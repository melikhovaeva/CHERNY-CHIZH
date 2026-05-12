from django.core.management.base import BaseCommand
from django.core.management import call_command


def ensure_default_roles():
    """
    Создаёт роли admin и user если они отсутствуют в БД.
    Идемпотентна — безопасно вызывать повторно.
    Data migration 0006 делает то же самое, но эта функция страхует
    на случай ручного запуска run_setup без полного пересоздания БД.
    """
    from user_management.models import Role, RolePermission

    DEFAULT_PERMISSIONS = [
        ("manage_users", "Управление пользователями"),
        ("manage_roles", "Управление ролями"),
        ("manage_courses", "Управление курсами"),
        ("manage_content", "Управление контентом"),
        ("view_crm", "Просмотр CRM"),
        ("manage_crm", "Управление CRM"),
    ]

    perm_objects = []
    for codename, description in DEFAULT_PERMISSIONS:
        perm, _ = RolePermission.objects.get_or_create(
            codename=codename,
            defaults={"description": description},
        )
        perm_objects.append(perm)

    admin_role, _ = Role.objects.get_or_create(
        code=Role.CODE_ADMIN,
        defaults={"label": "Администратор"},
    )
    admin_role.permissions.set(perm_objects)

    Role.objects.get_or_create(
        code=Role.CODE_USER,
        defaults={"label": "Пользователь"},
    )


class Command(BaseCommand):
    help = "Инициализация приложения: миграции, статические данные, дефолтные роли и пользователи"

    def handle(self, *args, **options):
        call_command("ensure_minio_bucket")
        call_command("migrate")

        ensure_default_roles()
        self.stdout.write(self.style.SUCCESS("Дефолтные роли проверены / созданы."))

        # Страницы «О нас» и «Контакты» — всегда, идемпотентно
        call_command("fill_static_pages")

        from common.models import Dog

        if not Dog.objects.exists():
            call_command("run_all_static_commands")
            call_command("run_all_test_commands")
            call_command("fill_static_breed_descriptions")
        else:
            self.stdout.write(
                self.style.WARNING(
                    "БД не пуста, пропускаю заполнение тестовыми и статическими данными."
                )
            )

        from django.contrib.auth import get_user_model

        User = get_user_model()

        if not User.objects.filter(email="admin@admin.com").exists():
            User.objects.create_superuser(
                email="admin@admin.com",
                password="admin",
                first_name="admin",
                last_name="admin",
            )
            self.stdout.write(self.style.SUCCESS("Создан администратор: admin@admin.com / admin"))
        else:
            self.stdout.write(self.style.WARNING("Администратор admin@admin.com уже существует."))

        if not User.objects.filter(email="user@user.com").exists():
            User.objects.create_user(
                email="user@user.com",
                password="user",
                first_name="user",
                last_name="user",
            )
            self.stdout.write(self.style.SUCCESS("Создан пользователь: user@user.com / user"))
        else:
            self.stdout.write(self.style.WARNING("Пользователь user@user.com уже существует."))
