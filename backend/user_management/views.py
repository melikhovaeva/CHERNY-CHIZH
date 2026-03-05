from django.conf import settings
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from drf_spectacular.utils import extend_schema

from education.models import CourseEnrollment
from education.serializers import CourseEnrollmentSerializer
from user_management.jwt_serializers import CookieTokenObtainPairSerializer, make_session_binding
from user_management.models import User
from user_management.permissions import IsAdmin
from user_management.schema import (
    CHANGE_PASSWORD_SCHEMA,
    COOKIE_LOGIN_SCHEMA,
    COOKIE_LOGOUT_SCHEMA,
    COOKIE_REFRESH_SCHEMA,
    JWT_OBTAIN_PAIR_SCHEMA,
    JWT_REFRESH_SCHEMA,
    MY_COURSES_VIEW_SCHEMA,
    PROFILE_VIEW_SCHEMA,
    REGISTER_STEP1_SCHEMA,
    REGISTER_STEP2_SCHEMA,
    USER_ADMIN_DETAIL_SCHEMA,
    USER_LIST_ADMIN_SCHEMA,
)
from user_management.serializers import (
    ChangePasswordSerializer,
    CurrentUserSerializer,
    RegisterStep1Serializer,
    RegisterStep2Serializer,
    UserRoleUpdateSerializer,
    UserSerializer,
)


def _to_snake_case(camel_str: str) -> str:
    """Преобразует camelCase в snake_case."""
    result = [camel_str[0].lower()] if camel_str else []
    for c in camel_str[1:]:
        result.append("_" + c.lower() if c.isupper() else c)
    return "".join(result)


def _keys_to_snake_case(data):
    """Рекурсивно преобразует ключи словаря из camelCase в snake_case."""
    if isinstance(data, dict):
        return {_to_snake_case(k): _keys_to_snake_case(v) for k, v in data.items()}
    if isinstance(data, list):
        return [_keys_to_snake_case(item) for item in data]
    return data


def _set_jwt_cookies_for_user(response: Response, user: User) -> None:
  """
  Создаёт пару refresh/access токенов с привязкой к сессии и кладёт их в httpOnly-cookies.
  Используется для автологина после регистрации.
  """
  refresh = RefreshToken.for_user(user)
  binding = make_session_binding()
  refresh[settings.JWT_SESSION_BINDING_CLAIM] = binding
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
  response.set_cookie(
    settings.SESSION_BINDING_COOKIE_NAME,
    binding,
    httponly=True,
    secure=settings.JWT_COOKIE_SECURE,
    samesite=settings.JWT_COOKIE_SAMESITE,
  )

@extend_schema(**REGISTER_STEP1_SCHEMA)
class RegisterStep1View(APIView):
  permission_classes = (permissions.AllowAny,)

  def post(self, request):
    serializer = RegisterStep1Serializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    return Response({"email": serializer.validated_data["email"]}, status=status.HTTP_200_OK)


@extend_schema(**REGISTER_STEP2_SCHEMA)
class RegisterStep2View(APIView):
  permission_classes = (permissions.AllowAny,)

  def post(self, request):
    # Фронт присылает camelCase (firstName, lastName); сериализатор ожидает snake_case.
    data = _keys_to_snake_case(dict(request.data))
    serializer = RegisterStep2Serializer(data=data)
    serializer.is_valid(raise_exception=True)
    user = serializer.save()
    response = Response(
      CurrentUserSerializer(user, context={"request": request}).data,
      status=status.HTTP_201_CREATED,
    )
    _set_jwt_cookies_for_user(response, user)
    return response


@extend_schema(**PROFILE_VIEW_SCHEMA)
class ProfileView(generics.RetrieveUpdateDestroyAPIView):
  serializer_class = CurrentUserSerializer
  permission_classes = (permissions.IsAuthenticated,)

  def get_object(self):
    return self.request.user

  def update(self, request, *args, **kwargs):
    partial = kwargs.pop("partial", False)
    instance = self.get_object()
    # Фронт присылает camelCase (firstName, lastName); сериализатор ожидает snake_case.
    data = _keys_to_snake_case(dict(request.data))
    serializer = self.get_serializer(instance, data=data, partial=partial)
    serializer.is_valid(raise_exception=True)
    self.perform_update(serializer)
    return Response(serializer.data)


@extend_schema(**MY_COURSES_VIEW_SCHEMA)
class MyCoursesView(generics.ListAPIView):
  serializer_class = CourseEnrollmentSerializer
  permission_classes = (permissions.IsAuthenticated,)

  def get_queryset(self):
    return (
      CourseEnrollment.objects.filter(user=self.request.user)
      .select_related("course")
      .order_by("created_at")
    )


@extend_schema(**CHANGE_PASSWORD_SCHEMA)
class ChangePasswordView(APIView):
  permission_classes = (permissions.IsAuthenticated,)

  def post(self, request):
    # Фронт присылает camelCase (oldPassword, newPassword, newPassword2); сериализатор ожидает snake_case.
    data = _keys_to_snake_case(dict(request.data))
    serializer = ChangePasswordSerializer(data=data, context={"request": request})
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(status=status.HTTP_204_NO_CONTENT)


@extend_schema(**USER_LIST_ADMIN_SCHEMA)
class UserListAdminView(generics.ListAPIView):
  queryset = User.objects.all().select_related("role").order_by("email")
  serializer_class = UserSerializer
  permission_classes = (IsAdmin,)


@extend_schema(**USER_ADMIN_DETAIL_SCHEMA)
class UserAdminDetailView(generics.RetrieveUpdateAPIView):
  queryset = User.objects.all().select_related("role")
  serializer_class = UserSerializer
  permission_classes = (IsAdmin,)
  http_method_names = ["get", "patch", "head", "options"]

  def get_serializer_class(self):
    if self.request.method == "PATCH":
      return UserRoleUpdateSerializer
    return UserSerializer


@extend_schema(**JWT_OBTAIN_PAIR_SCHEMA)
class JWTTokenObtainPairView(TokenObtainPairView):
  """Обёртка над стандартным TokenObtainPairView с описанием для Swagger."""

  serializer_class = TokenObtainPairSerializer


@extend_schema(**JWT_REFRESH_SCHEMA)
class JWTTokenRefreshView(TokenRefreshView):
  """Обёртка над стандартным TokenRefreshView с описанием для Swagger."""

  serializer_class = TokenRefreshSerializer


class CookieTokenObtainPairView(TokenObtainPairView):
  """
  Выдаёт пару access/refresh токенов с привязкой к сессии и кладёт их в httpOnly‑cookies.
  В теле ответа возвращает данные пользователя.
  """

  serializer_class = CookieTokenObtainPairSerializer
  permission_classes = (permissions.AllowAny,)

  @extend_schema(**COOKIE_LOGIN_SCHEMA)
  def post(self, request, *args, **kwargs):
    serializer = self.get_serializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    tokens = serializer.validated_data
    access = tokens.get("access")
    refresh = tokens.get("refresh")
    session_binding = tokens.get("session_binding")
    user: User = serializer.user

    response = Response(
        CurrentUserSerializer(user, context={"request": request}).data,
        status=status.HTTP_200_OK,
    )

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
    if session_binding:
      response.set_cookie(
        settings.SESSION_BINDING_COOKIE_NAME,
        session_binding,
        httponly=True,
        secure=settings.JWT_COOKIE_SECURE,
        samesite=settings.JWT_COOKIE_SAMESITE,
      )

    return response


class CookieTokenRefreshView(TokenRefreshView):
  """
  Обновляет access‑токен по refresh‑токену из httpOnly‑cookie.
  Проверяет привязку сессии: cookie session_binding должна совпадать с claim в refresh‑токене.
  """

  permission_classes = (permissions.AllowAny,)

  @extend_schema(**COOKIE_REFRESH_SCHEMA)
  def post(self, request, *args, **kwargs):
    refresh_token = request.COOKIES.get(settings.REFRESH_TOKEN_COOKIE_NAME)
    if not refresh_token:
      return Response(
        {"detail": "Refresh token is missing"},
        status=status.HTTP_401_UNAUTHORIZED,
      )

    # Проверка привязки сессии до обновления токена
    try:
      rt = RefreshToken(refresh_token)
      binding_claim = getattr(settings, "JWT_SESSION_BINDING_CLAIM", "session_binding")
      token_binding = rt.get(binding_claim) or rt.payload.get(binding_claim)
      cookie_binding = request.COOKIES.get(settings.SESSION_BINDING_COOKIE_NAME)
      if not token_binding or cookie_binding != token_binding:
        return Response(
          {"detail": "Session binding mismatch"},
          status=status.HTTP_401_UNAUTHORIZED,
        )
    except Exception:
      return Response(
        {"detail": "Invalid refresh token"},
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

  @extend_schema(**COOKIE_LOGOUT_SCHEMA)
  def post(self, request, *args, **kwargs):
    response = Response(status=status.HTTP_204_NO_CONTENT)
    response.delete_cookie(settings.ACCESS_TOKEN_COOKIE_NAME)
    response.delete_cookie(settings.REFRESH_TOKEN_COOKIE_NAME)
    response.delete_cookie(settings.SESSION_BINDING_COOKIE_NAME)
    return response