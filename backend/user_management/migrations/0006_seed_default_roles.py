from django.db import migrations


DEFAULT_PERMISSIONS = [
    ("manage_users", "Управление пользователями"),
    ("manage_roles", "Управление ролями"),
    ("manage_courses", "Управление курсами"),
    ("manage_content", "Управление контентом"),
    ("view_crm", "Просмотр CRM"),
    ("manage_crm", "Управление CRM"),
]

DEFAULT_ROLES = [
    ("admin", "Администратор"),
    ("user", "Пользователь"),
]


def seed_roles_and_permissions(apps, schema_editor):
    RolePermission = apps.get_model("user_management", "RolePermission")
    Role = apps.get_model("user_management", "Role")

    perm_objects = []
    for codename, description in DEFAULT_PERMISSIONS:
        perm, _ = RolePermission.objects.get_or_create(
            codename=codename,
            defaults={"description": description},
        )
        perm_objects.append(perm)

    admin_role, _ = Role.objects.get_or_create(
        code="admin",
        defaults={"label": "Администратор"},
    )
    admin_role.permissions.set(perm_objects)

    Role.objects.get_or_create(
        code="user",
        defaults={"label": "Пользователь"},
    )


def remove_seeded_roles(apps, schema_editor):
    Role = apps.get_model("user_management", "Role")
    RolePermission = apps.get_model("user_management", "RolePermission")

    Role.objects.filter(code__in=["admin", "user"]).delete()
    RolePermission.objects.filter(
        codename__in=[codename for codename, _ in DEFAULT_PERMISSIONS]
    ).delete()


class Migration(migrations.Migration):

    dependencies = [
        ("user_management", "0005_rolepermission_role_permissions"),
    ]

    operations = [
        migrations.RunPython(seed_roles_and_permissions, remove_seeded_roles),
    ]
