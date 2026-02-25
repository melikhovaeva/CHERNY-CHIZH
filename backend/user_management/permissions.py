"""
Права доступа по ролям: гость (неавторизованный), пользователь, персонал, админ.
На открытые эндпоинты явно ставится AllowAny; на закрытые — IsAuthenticated или IsStaff/IsAdmin.
"""

from rest_framework.permissions import BasePermission, IsAuthenticated


class IsAuthenticatedUser(IsAuthenticated):
    """Доступ только для аутентифицированного пользователя (роль user, staff или admin)."""

    def has_permission(self, request, view):
        return super().has_permission(request, view)


class IsStaff(BasePermission):
    """Доступ для персонала: is_authenticated и is_staff. Не даёт права менять настройки других пользователей."""

    def has_permission(self, request, view):
        return request.user.is_authenticated and getattr(request.user, "is_staff", False)


class IsAdmin(BasePermission):
    """Полный доступ: только суперпользователь. Может назначать роли другим пользователям."""

    def has_permission(self, request, view):
        return request.user.is_authenticated and getattr(request.user, "is_superuser", False)
