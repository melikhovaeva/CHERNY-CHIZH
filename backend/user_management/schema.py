"""
OpenAPI (drf-spectacular) схема для приложения user_management.
Расширения аутентификации и описания эндпоинтов пользователей и auth.
"""
from django.conf import settings
from drf_spectacular.extensions import OpenApiAuthenticationExtension
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import OpenApiExample, extend_schema
from rest_framework_simplejwt.serializers import (
    TokenObtainPairSerializer,
    TokenRefreshSerializer,
)

from education.serializers import CourseEnrollmentCreateSerializer, CourseEnrollmentSerializer
from user_management.serializers import (
    ChangePasswordSerializer,
    CurrentUserSerializer,
    RegisterStep1Serializer,
    RegisterStep2Serializer,
    UserRoleUpdateSerializer,
    UserSerializer,
)


class CookieJWTAuthenticationScheme(OpenApiAuthenticationExtension):
    target_class = "user_management.authentication.CookieJWTAuthentication"
    name = "CookieJWT"

    def get_security_definition(self, auto_schema):
        return {
            "type": "apiKey",
            "in": "cookie",
            "name": getattr(
                settings, "ACCESS_TOKEN_COOKIE_NAME", "access_token"
            ),
            "description": "JWT access token in httpOnly cookie. Optional: Authorization Bearer header.",
        }


# --- Регистрация и профиль ---
REGISTER_STEP1_SCHEMA = dict(
    tags=["Users"],
    summary="Регистрация — шаг 1 (email и пароль)",
    description=(
        "Первый шаг двухэтапной регистрации. Проверяет валидность email и пароля, "
        "но пользователя ещё не создаёт. Возвращает нормализованный email."
    ),
    request=RegisterStep1Serializer,
    responses={200: OpenApiTypes.OBJECT},
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

REGISTER_STEP2_SCHEMA = dict(
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

PROFILE_VIEW_SCHEMA = dict(
    tags=["Users"],
    summary="Профиль текущего пользователя",
    description=(
        "Получение, обновление или удаление профиля текущего аутентифицированного пользователя. "
        "Требует JWT-токен в заголовке Authorization."
    ),
    responses={200: CurrentUserSerializer},
)

MY_COURSES_VIEW_SCHEMA = dict(
    tags=["Users"],
    summary="Курсы текущего пользователя",
    description=(
        "Возвращает список записей пользователя на курсы с информацией о курсе, статусе и прогрессе."
    ),
    responses={200: CourseEnrollmentSerializer(many=True)},
)

MY_COURSE_ENROLL_SCHEMA = dict(
    tags=["Users"],
    summary="Записаться на курс",
    description=(
        "Создаёт или возвращает существующую запись пользователя на курс по идентификатору курса."
    ),
    request=CourseEnrollmentCreateSerializer,
    responses={201: CourseEnrollmentSerializer},
)

CHANGE_PASSWORD_SCHEMA = dict(
    tags=["Users"],
    summary="Смена пароля текущего пользователя",
    description=(
        "Меняет пароль текущего аутентифицированного пользователя. "
        "Требует указать старый пароль и дважды новый пароль."
    ),
    request=ChangePasswordSerializer,
    responses={204: None},
)

USER_LIST_ADMIN_SCHEMA = dict(
    tags=["Users"],
    summary="Список пользователей (только админ)",
    description="Возвращает список пользователей с полями профиля и ролью. Доступно только суперпользователю.",
)

USER_ADMIN_DETAIL_SCHEMA = dict(
    tags=["Users"],
    summary="Профиль пользователя по id (только админ)",
    description="GET — данные пользователя; PATCH — смена роли. Доступно только суперпользователю.",
    responses={200: UserSerializer},
)

# --- Auth (JWT) ---
JWT_OBTAIN_PAIR_SCHEMA = dict(
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

JWT_REFRESH_SCHEMA = dict(
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

COOKIE_LOGIN_SCHEMA = dict(
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

COOKIE_REFRESH_SCHEMA = dict(
    tags=["Auth"],
    summary="Обновить access-токен по cookie",
    description=(
        "Использует refresh‑токен из httpOnly‑cookie для выдачи нового access‑токена. "
        "В ответе тело пустое; новый access‑токен устанавливается в cookie."
    ),
    request=None,
    responses={204: None},
)

COOKIE_LOGOUT_SCHEMA = dict(
    tags=["Auth"],
    summary="Логаут (очистка JWT‑cookies)",
    description="Удаляет httpOnly‑cookies с access и refresh токенами.",
    request=None,
    responses={204: None},
)
