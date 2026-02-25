from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import OpenApiExample, extend_schema
from django.conf import settings
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from user_management.models import User
from user_management.permissions import IsAdmin
from user_management.serializers import (
  CurrentUserSerializer,
  RegisterSerializer,
  RegisterStep1Serializer,
  RegisterStep2Serializer,
  UserRoleUpdateSerializer,
  UserSerializer,
)


def _set_jwt_cookies_for_user(response: Response, user: User) -> None:
  """
  Создаёт пару refresh/access токенов для пользователя и кладёт их в httpOnly-cookies.
  Используется для автологина после регистрации.
  """
  refresh = RefreshToken.for_user(user)
  access = refresh.access_token

  response.set_cookie(
    settings.ACCESS_TOKEN_COOKIE_NAME,
    str(access),
    httponly=True,
    secure=settings.JWT_COOKIE_SECURE,
    samesite=settings.JWT_COOKIE_SAMESITE,
  )
  response.set_cookie(
    settings.REFRESH_TOKEN_COOKIE_NAME,
    str(refresh),
    httponly=True,
    secure=settings.JWT_COOKIE_SECURE,
    samesite=settings.JWT_COOKIE_SAMESITE,
  )

@extend_schema(
  tags=["Users"],
  summary="Регистрация — шаг 1 (email и пароль)",
  description=(
    "Первый шаг двухэтапной регистрации. Проверяет валидность email и пароля, "
    "но пользователя ещё не создаёт. Возвращает нормализованный email."
  ),
  request=RegisterStep1Serializer,
  responses={
    200: OpenApiTypes.OBJECT,
  },
  examples=[
    OpenApiExample(
      "Успешный шаг 1",
      value={
        "request": {
          "email": "user@example.com",
          "password": "S3curePassw0rd!",
          "password2": "S3curePassw0rd!",
        },
        "response": {
          "email": "user@example.com",
        },
      },
    ),
  ],
)
class RegisterStep1View(APIView):
  permission_classes = (permissions.AllowAny,)

  def post(self, request):
    serializer = RegisterStep1Serializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    return Response({"email": serializer.validated_data["email"]}, status=status.HTTP_200_OK)


@extend_schema(
  tags=["Users"],
  summary="Регистрация — шаг 2 (персональные данные)",
  description=(
    "Завершает двухэтапную регистрацию: создаёт пользователя на основании email, "
    "пароля и персональных данных."
  ),
  request=RegisterStep2Serializer,
  responses={201: CurrentUserSerializer},
  examples=[
    OpenApiExample(
      "Успешный шаг 2",
      value={
        "request": {
          "email": "user@example.com",
          "password": "S3curePassw0rd!",
          "password2": "S3curePassw0rd!",
          "first_name": "Иван",
          "last_name": "Иванов",
          "phone": "+79998887766",
          "messenger": "@ivan_ivanov",
        },
        "response": {
          "id": 1,
          "email": "user@example.com",
          "first_name": "Иван",
          "last_name": "Иванов",
          "phone": "+79998887766",
          "messenger": "@ivan_ivanов",
        },
      },
    ),
  ],
)
class RegisterStep2View(APIView):
  permission_classes = (permissions.AllowAny,)

  def post(self, request):
    serializer = RegisterStep2Serializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.save()
    response = Response(
      CurrentUserSerializer(user).data,
      status=status.HTTP_201_CREATED,
    )
    _set_jwt_cookies_for_user(response, user)
    return response


@extend_schema(
  tags=["Users"],
  summary="Профиль текущего пользователя",
  description=(
    "Получение, обновление или удаление профиля текущего аутентифицированного пользователя. "
    "Требует JWT-токен в заголовке Authorization."
  ),
  responses={
    200: CurrentUserSerializer,
  },
)
class ProfileView(generics.RetrieveUpdateDestroyAPIView):
  serializer_class = CurrentUserSerializer
  permission_classes = (permissions.IsAuthenticated,)

  def get_object(self):
    return self.request.user


@extend_schema(
  tags=["Users"],
  summary="Список пользователей (только админ)",
  description="Возвращает список пользователей с полями профиля и ролью. Доступно только суперпользователю.",
)
class UserListAdminView(generics.ListAPIView):
  queryset = User.objects.all().select_related("role").order_by("email")
  serializer_class = UserSerializer
  permission_classes = (IsAdmin,)


@extend_schema(
  tags=["Users"],
  summary="Профиль пользователя по id (только админ)",
  description="GET — данные пользователя; PATCH — смена роли. Доступно только суперпользователю.",
  responses={200: UserSerializer},
)
class UserAdminDetailView(generics.RetrieveUpdateAPIView):
  queryset = User.objects.all().select_related("role")
  serializer_class = UserSerializer
  permission_classes = (IsAdmin,)
  http_method_names = ["get", "patch", "head", "options"]

  def get_serializer_class(self):
    if self.request.method == "PATCH":
      return UserRoleUpdateSerializer
    return UserSerializer


@extend_schema(
  tags=["Auth"],
  summary="Получить JWT-токен",
  description=(
    "Получение пары access/refresh JWT-токенов по email и паролю пользователя. "
    "Используйте полученный access-токен в заголовке Authorization: Bearer <token>."
  ),
  request=TokenObtainPairSerializer,
  responses={200: TokenObtainPairSerializer},
  examples=[
    OpenApiExample(
      "Успешное получение токена",
      value={
        "request": {
          "email": "user@example.com",
          "password": "S3curePassw0rd!",
        },
        "response": {
          "access": "<jwt-access-token>",
          "refresh": "<jwt-refresh-token>",
        },
      },
    ),
  ],
)
class JWTTokenObtainPairView(TokenObtainPairView):
  """Обёртка над стандартным TokenObtainPairView с описанием для Swagger."""

  serializer_class = TokenObtainPairSerializer


@extend_schema(
  tags=["Auth"],
  summary="Обновить JWT access-токен",
  description=(
    "Обновление access-токена по действующему refresh-токену. "
    "Тело запроса содержит только refresh-токен."
  ),
  request=TokenRefreshSerializer,
  responses={200: TokenRefreshSerializer},
  examples=[
    OpenApiExample(
      "Успешное обновление токена",
      value={
        "request": {
          "refresh": "<jwt-refresh-token>",
        },
        "response": {
          "access": "<new-jwt-access-token>",
        },
      },
    ),
  ],
)
class JWTTokenRefreshView(TokenRefreshView):
  """Обёртка над стандартным TokenRefreshView с описанием для Swagger."""

  serializer_class = TokenRefreshSerializer


class CookieTokenObtainPairView(TokenObtainPairView):
  """
  Выдаёт пару access/refresh токенов и кладёт их в httpOnly‑cookies.
  В теле ответа возвращает данные пользователя.
  """

  permission_classes = (permissions.AllowAny,)

  @extend_schema(
    tags=["Auth"],
    summary="Логин с установкой JWT в cookies",
    description=(
      "Аутентификация по email и паролю. "
      "Access и refresh токены устанавливаются в httpOnly‑cookies. "
      "В ответе возвращается профиль пользователя."
    ),
    request=TokenObtainPairSerializer,
    responses={200: CurrentUserSerializer},
    examples=[
      OpenApiExample(
        "Успешный логин",
        value={
          "request": {
            "email": "user@example.com",
            "password": "S3curePassw0rd!",
          },
          "response": {
            "id": 1,
            "email": "user@example.com",
            "first_name": "Иван",
            "last_name": "Иванов",
            "phone": "+79998887766",
            "messenger": "@ivan_ivanov",
          },
        },
      ),
    ],
  )
  def post(self, request, *args, **kwargs):
    serializer = self.get_serializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    tokens = serializer.validated_data
    access = tokens.get("access")
    refresh = tokens.get("refresh")
    user: User = serializer.user

    response = Response(CurrentUserSerializer(user).data, status=status.HTTP_200_OK)

    if access:
      response.set_cookie(
        settings.ACCESS_TOKEN_COOKIE_NAME,
        access,
        httponly=True,
        secure=settings.JWT_COOKIE_SECURE,
        samesite=settings.JWT_COOKIE_SAMESITE,
      )
    if refresh:
      response.set_cookie(
        settings.REFRESH_TOKEN_COOKIE_NAME,
        refresh,
        httponly=True,
        secure=settings.JWT_COOKIE_SECURE,
        samesite=settings.JWT_COOKIE_SAMESITE,
      )

    return response


class CookieTokenRefreshView(TokenRefreshView):
  """
  Обновляет access‑токен по refresh‑токену из httpOnly‑cookie.
  Токен в теле запроса не требуется.
  """

  permission_classes = (permissions.AllowAny,)

  @extend_schema(
    tags=["Auth"],
    summary="Обновить access-токен по cookie",
    description=(
      "Использует refresh‑токен из httpOnly‑cookie для выдачи нового access‑токена. "
      "В ответе тело пустое; новый access‑токен устанавливается в cookie."
    ),
    request=None,
    responses={204: None},
  )
  def post(self, request, *args, **kwargs):
    refresh_token = request.COOKIES.get(settings.REFRESH_TOKEN_COOKIE_NAME)
    if not refresh_token:
      return Response(
        {"detail": "Refresh token is missing"},
        status=status.HTTP_401_UNAUTHORIZED,
      )

    serializer = TokenRefreshSerializer(data={"refresh": refresh_token})
    serializer.is_valid(raise_exception=True)
    access = serializer.validated_data.get("access")

    response = Response(status=status.HTTP_204_NO_CONTENT)
    if access:
      response.set_cookie(
        settings.ACCESS_TOKEN_COOKIE_NAME,
        access,
        httponly=True,
        secure=settings.JWT_COOKIE_SECURE,
        samesite=settings.JWT_COOKIE_SAMESITE,
      )

    return response


class CookieLogoutView(TokenObtainPairView):
  """
  Удаляет JWT‑cookies, разлогинивая пользователя на клиенте.
  """

  permission_classes = (permissions.AllowAny,)

  @extend_schema(
    tags=["Auth"],
    summary="Логаут (очистка JWT‑cookies)",
    description="Удаляет httpOnly‑cookies с access и refresh токенами.",
    request=None,
    responses={204: None},
  )
  def post(self, request, *args, **kwargs):
    response = Response(status=status.HTTP_204_NO_CONTENT)
    response.delete_cookie(settings.ACCESS_TOKEN_COOKIE_NAME)
    response.delete_cookie(settings.REFRESH_TOKEN_COOKIE_NAME)
    return response