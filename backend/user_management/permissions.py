"""
Права доступа по ролям: гость (неавторизованный), пользователь, персонал, админ.
На открытые эндпоинты явно ставится AllowAny; на закрытые — IsAuthenticated или IsStaff/IsAdmin.

Для гранулярного контроля по конкретному разрешению используй HasRolePermission:

    class CanManageCourses(HasRolePermission):
        required_permission = "manage_courses"
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


class HasRolePermission(BasePermission):
    """
    Проверяет наличие конкретного разрешения у роли пользователя.

    Использование — создай подкласс и укажи required_permission:

        class CanManageCourses(HasRolePermission):
            required_permission = "manage_courses"

    Доступные коды разрешений задаются в модели RolePermission и назначаются ролям.
    """

    required_permission: str = ""

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        role = getattr(request.user, "role", None)
        if role is None:
            return False
        if not self.required_permission:
            return False
        return role.has_permission(self.required_permission)


class CanManageUsers(HasRolePermission):
    required_permission = "manage_users"


class CanManageRoles(HasRolePermission):
    required_permission = "manage_roles"


class CanManageCourses(HasRolePermission):
    required_permission = "manage_courses"


class CanManageContent(HasRolePermission):
    required_permission = "manage_content"


class CanViewCRM(HasRolePermission):
    required_permission = "view_crm"


class CanManageCRM(HasRolePermission):
    required_permission = "manage_crm"
