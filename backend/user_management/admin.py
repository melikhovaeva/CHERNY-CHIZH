from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import Group

from .forms import UserCreationForm
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    add_form = UserCreationForm
    list_display = ("email", "first_name", "last_name", "is_active", "is_staff", "date_joined")
    list_filter = ("is_active", "is_staff")
    search_fields = ("email", "first_name", "last_name")
    ordering = ("email",)

    fieldsets = (
        (None, {"fields": ("email", "password_display")}),
        ("Имя", {"fields": ("first_name", "last_name")}),
        ("Контакты", {"fields": ("phone", "messenger")}),
        ("Статус", {"fields": ("is_active", "is_staff", "is_superuser")}),
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

    def get_readonly_fields(self, request, obj=None):
        readonly = list(super().get_readonly_fields(request, obj))
        if not request.user.is_superuser and obj is not None:
            readonly.extend(("is_superuser", "is_staff"))
        return readonly

    def get_fieldsets(self, request, obj=None):
        if obj is None:
            return self.add_fieldsets
        return self.fieldsets


# Скрываем Groups и Permissions из админки
admin.site.unregister(Group)