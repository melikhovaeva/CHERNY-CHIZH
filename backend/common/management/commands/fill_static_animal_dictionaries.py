from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = (
        "Ранее команда заполняла БД справочниками пола/статуса/потенциала. "
        "Теперь эти значения захардкожены в моделях, команда ничего не делает."
    )

    def handle(self, *args, **options):
        self.stdout.write(
            self.style.WARNING(
                "Справочники животных больше не хранятся в БД. "
                "Команда fill_static_animal_dictionaries ничего не делает."
            )
        )
