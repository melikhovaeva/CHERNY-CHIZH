from django.core.management import call_command
from django.core.management.base import BaseCommand, CommandError


STATIC_COMMANDS = [
    "fill_static_breed_descriptions",
    "fill_static_animal_dictionaries",
    "fill_static_faq",
]


class Command(BaseCommand):
    def handle(self, *args, **options):
        for command_name in STATIC_COMMANDS:
            self.stdout.write(
                self.style.MIGRATE_HEADING(
                    f"==> {command_name}"
                )
            )
            try:
                call_command(command_name)
            except Exception as exc:
                raise CommandError(
                    f"{command_name} error: {exc}"
                ) from exc

        self.stdout.write(self.style.SUCCESS("SUCCESS"))
