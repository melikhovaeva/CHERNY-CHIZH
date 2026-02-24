from user_management.models import UserAccount
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import OpenApiExample, extend_schema
from user_management.serializers import (
  RegisterSerializer,
  RegisterStep1Serializer,
  RegisterStep2Serializer,
  UserAccountSerializer,
)


@extend_schema(
  tags=["Users"],
  summary="Регистрация пользователя (одним шагом)",
  description=(
    "Создаёт нового пользователя по полной форме регистрации. "
    "Используется, если фронтенд не разбивает регистрацию на шаги."
  ),
  request=RegisterSerializer,
  responses={201: UserAccountSerializer},
  examples=[
    OpenApiExample(
      "Успешная регистрация",
      description="Пример тела запроса и ответа при успешной регистрации.",
      value={
        "request": {
          "email": "user@example.com",
          "password": "S3curePassw0rd!",
          "password2": "S3curePassw0rd!",
          "first_name": "Иван",
          "last_name": "Иванов",
        },
        "response": {
          "id": 1,
          "email": "user@example.com",
          "first_name": "Иван",
          "last_name": "Иванов",
        },
      },
    ),
  ],
)
class RegisterView(generics.CreateAPIView):
  queryset = UserAccount.objects.all()
  permission_classes = (permissions.AllowAny,)
  serializer_class = RegisterSerializer


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
  responses={201: UserAccountSerializer},
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
          "telegram": "@ivan_ivanov",
        },
        "response": {
          "id": 1,
          "email": "user@example.com",
          "first_name": "Иван",
          "last_name": "Иванов",
          "phone": "+79998887766",
          "telegram": "@ivan_ivanov",
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
    return Response(
      {
        "id": user.id,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "phone": user.phone,
        "telegram": user.telegram,
      },
      status=status.HTTP_201_CREATED,
    )


@extend_schema(
  tags=["Users"],
  summary="Профиль текущего пользователя",
  description=(
    "Получение, обновление или удаление профиля текущего аутентифицированного пользователя. "
    "Требует JWT-токен в заголовке Authorization."
  ),
  responses={
    200: UserAccountSerializer,
  },
)
class ProfileView(generics.RetrieveUpdateDestroyAPIView):
  serializer_class = UserAccountSerializer
  permission_classes = (permissions.IsAuthenticated,)

  def get_object(self):
    return self.request.user