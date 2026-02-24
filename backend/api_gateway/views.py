from drf_spectacular.utils import OpenApiExample, extend_schema
from rest_framework_simplejwt.serializers import (
    TokenObtainPairSerializer,
    TokenRefreshSerializer,
)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


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

