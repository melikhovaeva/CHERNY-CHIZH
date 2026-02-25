import random
from datetime import date, timedelta

from django.core.management.base import BaseCommand, CommandError

from common.models import Breed, Dog, DogPotential, DogSex, DogStatus

from .fill_test_puppies import (
    COLORS,
    DEFAULT_BREEDS,
    DESCRIPTIONS_FEMALE,
    DESCRIPTIONS_MALE,
)
from ._test_photos import assign_photo_from_path, get_photos_by_breed


BREED_DOG_NAMES = {
    "Шпиц": [
        # Матери
        "Альфа Зимняя Искорка",
        "Белла Золотой Хвост",
        "Луна Ночной Огонёк",
        "Мила Тёплый Плюш",
        "Нора Рыжая Радость",
        "Фиона Медовый Снег",
        # Отцы
        "Арчи Весёлый Вихрь",
        "Бакс Маленький Лис",
        "Роки Яркий Огнек",
        "Лаки Солнечный Луч",
        "Тедди Мягкий Медвежонок",
        "Оскар Янтарный Хвост",
    ],
    "Корги": [
        # Матери
        "Леди Рыжий Пирожок",
        "Белка Длинный Хвостик",
        "Фея Короткая Лапка",
        "Соль Хрустящий Бублик",
        "Ириска Солнечный Лучик",
        "Карамель Тёплый Пончик",
        # Отцы
        "Сэр Рыжий Пастух",
        "Барон Кусочек Сыра",
        "Граф Весёлый Крендель",
        "Джэк Хвостатый Джентльмен",
        "Ральф Маленький Лис",
        "Макс Весёлый Бочонок",
    ],
    "Сиба ину": [
        # Матери
        "Акира Огненная Лиса",
        "Хана Утренняя Заря",
        "Мика Золотой Рассвет",
        "Юна Красный Лотос",
        "Сора Тихое Небо",
        "Рин Тающая Сakura",
        # Отцы
        "Рю Огненный Самурай",
        "Кен Лисьий Ветер",
        "Таке Красный Воин",
        "Хиро Горный Рассвет",
        "Дайти Каменный Лис",
        "Син Голос Грома",
    ],
    "Шарпей": [
        # Матери
        "Жемчужина Тёплый Плед",
        "Майя Молочный Орешек",
        "Долли Морозный Зефир",
        "Чайка Медовый Пирог",
        "Сима Бархатный Плюш",
        "Лада Тихий Облачок",
        # Отцы
        "Бао Морщинистый Лев",
        "Чай Плотный Пломбир",
        "Тай Мягкий Бурбон",
        "Шоу Рыжий Барин",
        "Гуф Бархатный Тигр",
        "Рэй Уютный Бублик",
    ],
}


class Command(BaseCommand):
    def add_arguments(self, parser):
        parser.add_argument(
            "--clear",
            action="store_true",
            help="delete all dogs",
        )

    def handle(self, *args, **options):
        clear: bool = options["clear"]

        female_sex = DogSex.FEMALE.value
        male_sex = DogSex.MALE.value

        statuses = [
            DogStatus.ON_SALE.value,
            DogStatus.BOOKED.value,
            DogStatus.SOLD.value,
        ]
        potentials = [
            DogPotential.PET.value,
            DogPotential.SHOW.value,
            DogPotential.BREEDING.value,
        ]

        breeds = {}
        for short_name, full_name in DEFAULT_BREEDS:
            breed, _ = Breed.objects.get_or_create(
                name=short_name,
                defaults={"full_name": full_name},
            )
            breeds[short_name] = breed

        photos_by_breed = get_photos_by_breed()
        for breed_name, paths in photos_by_breed.items():
            breed = breeds.get(breed_name)
            if breed and paths and not breed.photo:
                assign_photo_from_path(
                    breed,
                    "photo",
                    paths[0],
                    f"breeds/{breed.slug}_{paths[0].name}",
                )

        if clear:
            deleted, _ = Dog.objects.filter(age_group=Dog.AGE_GROUP_ADULT).delete()
            self.stdout.write(
                self.style.WARNING(f"Dogs deleted: {deleted}")
            )

        today = date.today()
        created = 0

        for breed_name, breed in breeds.items():
            dog_names = BREED_DOG_NAMES.get(breed_name, [])
            if len(dog_names) < 12:
                raise CommandError(
                    f"Not enough dog names for breed '{breed_name}'. "
                    "Expected at least 12."
                )

            mother_names = dog_names[:6]
            father_names = dog_names[6:12]

            for name in mother_names:
                birth_date = today - timedelta(days=random.randint(365 * 2, 365 * 10))
                desc_template = random.choice(DESCRIPTIONS_FEMALE)
                Dog.objects.create(
                    name=name,
                    breed=breed,
                    age_group=Dog.AGE_GROUP_ADULT,
                    status=random.choice(statuses),
                    birth_date=birth_date,
                    sex=female_sex,
                    color=random.choice(COLORS),
                    potential=random.choice(potentials),
                    description=desc_template.format(name=name),
                )
                created += 1

            for name in father_names:
                birth_date = today - timedelta(days=random.randint(365 * 2, 365 * 10))
                desc_template = random.choice(DESCRIPTIONS_MALE)
                Dog.objects.create(
                    name=name,
                    breed=breed,
                    age_group=Dog.AGE_GROUP_ADULT,
                    status=random.choice(statuses),
                    birth_date=birth_date,
                    sex=male_sex,
                    color=random.choice(COLORS),
                    potential=random.choice(potentials),
                    description=desc_template.format(name=name),
                )
                created += 1

        self.stdout.write(
            self.style.SUCCESS(f"Создано тестовых собак: {created}")
        )

