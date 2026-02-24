from django.core.management.base import BaseCommand
from django.core.management import call_command


class Command(BaseCommand):
    help = "Тестовая команда для наполнения БД"

    def handle(self, *args, **options):
        call_command("ensure_minio_bucket")
        call_command("migrate")
        from common.models import Dog 
        from django.contrib.auth import get_user_model

        if not Dog.objects.exists():
            call_command("run_all_static_commands")
            call_command("run_all_test_commands")
        else:
            self.stdout.write(
                self.style.WARNING(
                    "БД не пуста, пропускаю заполнение тестовыми и статическими данными."
                )
            )

        User = get_user_model()
        if not User.objects.filter(email="admin@admin.com").exists():
            User.objects.create_superuser(
                email="admin@admin.com",
                password="admin",
                first_name="admin",
                last_name="admin",
            )