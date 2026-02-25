from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import Group

from .forms import UserCreationForm
from .models import Role, User


@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ("code", "label")
    ordering = ("code",)


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