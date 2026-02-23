from django.core.management.base import BaseCommand

from common.models import AnimalPotential, AnimalSex, AnimalStatus


ANIMAL_STATUSES = [
    ("on_sale", "В продаже"),
    ("booked", "Забронирован"),
    ("sold", "Куплен"),
]

ANIMAL_SEXES = [
    ("male", "Мальчик"),
    ("female", "Девочка"),
]

ANIMAL_POTENTIALS = [
    ("pet", "Домашний питомец"),
    ("show", "Шоу"),
    ("breeding", "Разведение"),
]


class Command(BaseCommand):
    def handle(self, *args, **options):
        created = 0
        for code, label in ANIMAL_STATUSES:
            _, c = AnimalStatus.objects.get_or_create(code=code, defaults={"label": label})
            if c:
                created += 1
        for code, label in ANIMAL_SEXES:
            _, c = AnimalSex.objects.get_or_create(code=code, defaults={"label": label})
            if c:
                created += 1
        for code, label in ANIMAL_POTENTIALS:
            _, c = AnimalPotential.objects.get_or_create(code=code, defaults={"label": label})
            if c:
                created += 1
        self.stdout.write(
            self.style.SUCCESS(f"Справочники животных: создано новых записей {created}.")
        )
