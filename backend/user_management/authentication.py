from rest_framework.exceptions import AuthenticationFailed

from django.conf import settings
from rest_framework_simplejwt.authentication import JWTAuthentication


def _get_request_binding(request, token_from_cookie: bool) -> str | None:
    """Возвращает значение привязки сессии из cookie или заголовка."""
    if token_from_cookie:
        return request.COOKIES.get(settings.SESSION_BINDING_COOKIE_NAME)
    return request.META.get("HTTP_X_SESSION_BINDING")


def _check_session_binding(request, validated_token, token_from_cookie: bool) -> None:
    """
    Проверяет, что привязка сессии в запросе совпадает с привязкой в токене.
    Без этого токен, скопированный в другой браузер, не будет принят.
    """
    claim_name = getattr(
        settings, "JWT_SESSION_BINDING_CLAIM", "session_binding"
    )
    token_binding = validated_token.get(claim_name)
    if not token_binding:
        raise AuthenticationFailed("Token has no session binding.")
    request_binding = _get_request_binding(request, token_from_cookie)
    if not request_binding or request_binding != token_binding:
        raise AuthenticationFailed("Session binding mismatch.")
    return None


class CookieJWTAuthentication(JWTAuthentication):
    """
    JWT-аутентификация с привязкой к сессии (token binding).

    1. Читает access-токен из заголовка Authorization или из httpOnly cookie.
    2. Проверяет, что cookie session_binding (или заголовок X-Session-Binding)
       совпадает с claim session_binding в токене — иначе токен считается недействительным.
    """

    def authenticate(self, request):
        header = self.get_header(request)
        token_from_cookie = False
        if header is not None:
            raw_token = self.get_raw_token(header)
        else:
            raw_token = request.COOKIES.get(settings.ACCESS_TOKEN_COOKIE_NAME)
            if raw_token is None:
                return None
            token_from_cookie = True
        if raw_token is None:
            return None
        if isinstance(raw_token, bytes):
            raw_token = raw_token.decode("utf-8")

        validated_token = self.get_validated_token(raw_token)
        _check_session_binding(request, validated_token, token_from_cookie)
        return self.get_user(validated_token), validated_token

