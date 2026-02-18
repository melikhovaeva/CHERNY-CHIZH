from django.core.management import call_command
from django.core.management.base import BaseCommand, CommandError


TEST_COMMANDS = [
    "fill_test_breed_descriptions",
    "fill_test_puppies",
]


class Command(BaseCommand):
    def handle(self, *args, **options):
        for command_name in TEST_COMMANDS:
            self.stdout.write(
                self.style.MIGRATE_HEADING(f"==> {command_name}")
            )
            try:
                call_command(command_name)
            except Exception as exc:
                raise CommandError(
                    f"{command_name} error: {exc}"
                ) from exc

        self.stdout.write(self.style.SUCCESS("SUCCESS"))

