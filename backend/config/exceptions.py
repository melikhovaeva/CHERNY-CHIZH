from django.conf import settings

from rest_framework.views import exception_handler as drf_exception_handler
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.response import Response

from rest_framework_simplejwt.exceptions import InvalidToken, TokenError


def custom_exception_handler(exc, context):
    response: Response | None = drf_exception_handler(exc, context)

    if response is None:
        return None

    if isinstance(exc, (InvalidToken, TokenError)):
        response.delete_cookie(settings.ACCESS_TOKEN_COOKIE_NAME)
        response.delete_cookie(settings.REFRESH_TOKEN_COOKIE_NAME)
        return response

    if isinstance(exc, AuthenticationFailed):
        message = str(exc).lower()
        if "token" in message or "jwt" in message:
            response.delete_cookie(settings.ACCESS_TOKEN_COOKIE_NAME)
            response.delete_cookie(settings.REFRESH_TOKEN_COOKIE_NAME)

    return response

