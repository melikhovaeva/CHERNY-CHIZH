from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import Group

from .forms import UserCreationForm
from .models import Role, RolePermission, User

PROTECTED_ROLE_CODES = {Role.CODE_ADMIN, Role.CODE_USER}


@admin.register(RolePermission)
class RolePermissionAdmin(admin.ModelAdmin):
    list_display = ("codename", "description")
    search_fields = ("codename", "description")
    ordering = ("codename",)


@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ("code", "label", "permissions_list")
    ordering = ("code",)
    filter_horizontal = ("permissions",)

    def permissions_list(self, obj):
        perms = obj.permissions.all()
        if not perms:
            return "—"
        return ", ".join(p.description for p in perms)

    permissions_list.short_description = "Разрешения"

    def get_readonly_fields(self, request, obj=None):
        if obj and obj.code in PROTECTED_ROLE_CODES:
            return ("code",)
        return ()


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    add_form = UserCreationForm
    list_display = ("email", "first_name", "last_name", "is_active", "role", "date_joined")
    list_filter = ("is_active", "role")
    search_fields = ("email", "first_name", "last_name")
    ordering = ("email",)

    fieldsets = (
        (None, {"fields": ("email", "password_display")}),
        ("Имя", {"fields": ("first_name", "last_name")}),
        ("Контакты", {"fields": ("phone", "messenger")}),
        ("Аватар", {"fields": ("avatar_image",)}),
        ("Статус", {"fields": ("is_active", "role")}),
        ("Даты", {"fields": ("last_login", "date_joined")}),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("email", "first_name", "last_name", "password1", "password2"),
            },
        ),
    )

    readonly_fields = ("last_login", "date_joined", "password_display")

    def password_display(self, obj):
        if not obj or not obj.pk:
            return "—"
        return "********" if obj.password else "Не установлен"

    password_display.short_description = "пароль"

    def get_fieldsets(self, request, obj=None):
        if obj is None:
            return self.add_fieldsets
        return self.fieldsets


# Скрываем Groups и Permissions из админки
admin.site.unregister(Group)
