"""
JWT-сериализаторы с привязкой токена к сессии (token binding).
Токен действителен только вместе с cookie session_binding.
"""
import secrets

import jwt
from django.conf import settings
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken


def make_session_binding() -> str:
    """Генерирует уникальный идентификатор привязки сессии."""
    return secrets.token_urlsafe(32)


class CookieTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Выдаёт пару access/refresh с claim'ом session_binding.
    При аутентификации сервер проверяет, что cookie session_binding совпадает с claim в токене.
    """

    @classmethod
    def get_token(cls, user):
        token: RefreshToken = super().get_token(user)
        binding = make_session_binding()
        token[settings.JWT_SESSION_BINDING_CLAIM] = binding
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        # Достаём session_binding из access-токена, чтобы view мог установить cookie
        try:
            payload = jwt.decode(
                data["access"],
                options={"verify_signature": False},
            )
            data["session_binding"] = payload.get(settings.JWT_SESSION_BINDING_CLAIM)
        except (jwt.DecodeError, KeyError):
            data["session_binding"] = None
        return data
