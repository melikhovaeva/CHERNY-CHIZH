import random
from datetime import date, timedelta

from django.core.management.base import BaseCommand, CommandError

from common.models import (
    AnimalPotential,
    AnimalSex,
    AnimalStatus,
    Breed,
    Puppy,
)


COLORS = [
    "рыжий",
    "черный",
    "белый",
    "шоколадный",
    "палевый",
    "серо-белый",
    "черно-белый",
    "мраморный",
]


DESCRIPTIONS = [
    "Очень активный и игривый щенок.",
    "Спокойный характер, отлично подойдёт для семьи с детьми.",
    "Обожает гулять и играть с мячом.",
    "Любит внимание и быстро привыкает к людям.",
    "Перспективный щенок для выставок.",
]


DEFAULT_BREEDS = [
    ("Шпиц", "Померанский шпиц"),
    ("Корги", "Вельш-корги пемброк"),
    ("Сиба ину", "Сиба-ину"),
    ("Шарпей", "Китайский шарпей"),
]


BREED_PUPPY_NAMES = {
    "Шпиц": [
        "Цертум Ест",
        "Честер (Булка)",
        "Рой Кен",
        "Марти",
        "Тофи",
        "Яндекс",
    ],
    "Корги": [
        "Лорд Весёлый Хвост",
        "Леди Долгий Бублик",
        "Сэр Крендель Хрустящий",
        "Герцог Рыжий Обрезанный",
        "Барон Маленький Рыцарь",
        "Принцесса Короткая Лапка",
    ],
    "Сиба ину": [
        "Кенджи Огненный Лис",
        "Юки Северный Ветер",
        "Хана Цветок Зарницы",
        "Таро Красный Самурай",
        "Мико Золотое Солнце",
        "Акира Утренняя Звезда",
    ],
    "Шарпей": [
        "Бонус Морщинистый Дракон",
        "Чай Листовой Плюш",
        "Пломбир Молочный Медведь",
        "Султан Гладкий Бархат",
        "Жасмин Тёплый Пирог",
        "Хабиб Добрый Бульдозер",
    ],
}


class Command(BaseCommand):
    def add_arguments(self, parser):
        parser.add_argument(
            "--clear",
            action="store_true",
            help="delete all puppies",
        )

    def handle(self, *args, **options):
        clear: bool = options["clear"]

        statuses = list(AnimalStatus.objects.all())
        sexes = list(AnimalSex.objects.all())
        potentials = list(AnimalPotential.objects.all())

        if not statuses or not sexes or not potentials:
            raise CommandError(
                "AnimalStatus / AnimalSex / AnimalPotential not found."
            )

        breeds = {}
        for short_name, full_name in DEFAULT_BREEDS:
            breed, _ = Breed.objects.get_or_create(
                name=short_name,
                defaults={"full_name": full_name},
            )
            breeds[short_name] = breed

        if clear:
            deleted, _ = Puppy.objects.all().delete()
            self.stdout.write(
                self.style.WARNING(f"Puppies deleted: {deleted}")
            )

        today = date.today()

        created = 0
        for breed_name, breed in breeds.items():
            names = BREED_PUPPY_NAMES.get(breed_name, [])
            for name in names:
                birth_date = today - timedelta(days=random.randint(60, 365))
                Puppy.objects.create(
                    name=name,
                    breed=breed,
                    status=random.choice(statuses),
                    birth_date=birth_date,
                    sex=random.choice(sexes),
                    color=random.choice(COLORS),
                    potential=random.choice(potentials),
                    description=random.choice(DESCRIPTIONS),
                )
                created += 1

        self.stdout.write(
            self.style.SUCCESS(f"Создано тестовых щенков: {created}")
        )
