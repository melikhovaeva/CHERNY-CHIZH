import random
from datetime import date, timedelta

from django.core.management.base import BaseCommand, CommandError

from common.models import (
    AnimalPotential,
    AnimalSex,
    AnimalStatus,
    Breed,
    Dog,
    Puppy,
    PuppyDocument,
    PuppyParents,
    PuppyPhoto,
)

from ._test_photos import assign_photo_from_path, get_photos_by_breed


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


PUPPY_DOCUMENT_NAMES = [
    "Договор купли-продажи",
    "Метрика щенка",
    "Ветеринарный паспорт",
]


class Command(BaseCommand):
    def add_arguments(self, parser):
        parser.add_argument(
            "--clear",
            action="store_true",
            help="delete all puppies",
        )

    def handle(self, *args, **options):
        clear: bool = options["clear"]

        try:
            female_sex = AnimalSex.objects.get(code="female")
            male_sex = AnimalSex.objects.get(code="male")
        except AnimalSex.DoesNotExist as e:
            raise CommandError(
                "В справочнике пола нужны записи с code='female' и code='male'. "
            ) from e

        statuses = list(
            AnimalStatus.objects.filter(
                code__in=["on_sale", "booked", "sold"]
            )
        )
        potentials = list(
            AnimalPotential.objects.filter(
                code__in=["pet", "show", "breeding"]
            )
        )
        if not statuses or not potentials:
            raise CommandError(
                "В справочниках статуса и потенциала должны быть записи с кодами "
            )

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
            deleted, _ = Puppy.objects.all().delete()
            self.stdout.write(
                self.style.WARNING(f"Puppies deleted: {deleted}")
            )

        today = date.today()
        sexes = [female_sex, male_sex]

        created = 0
        puppies_by_breed = {}
        for breed_name, breed in breeds.items():
            names = BREED_PUPPY_NAMES.get(breed_name, [])
            puppies_by_breed[breed_name] = []
            for name in names:
                birth_date = today - timedelta(days=random.randint(60, 365))
                puppy = Puppy.objects.create(
                    name=name,
                    breed=breed,
                    status=random.choice(statuses),
                    birth_date=birth_date,
                    sex=random.choice(sexes),
                    color=random.choice(COLORS),
                    potential=random.choice(potentials),
                    description=random.choice(DESCRIPTIONS),
                )
                puppies_by_breed[breed_name].append(puppy)
                created += 1

                breed_photos = photos_by_breed.get(breed_name, [])
                if breed_photos:
                    chosen = random.sample(
                        breed_photos,
                        min(random.randint(2, 5), len(breed_photos)),
                    )
                    for order, photo_path in enumerate(chosen):
                        pp = PuppyPhoto(puppy=puppy, order=order)
                        assign_photo_from_path(
                            pp,
                            "photo",
                            photo_path,
                            f"puppies/{puppy.id}_{order}_{photo_path.name}",
                        )

        parents_created = 0
        used_dog_ids = set(PuppyParents.objects.values_list("dog_id", flat=True))
        for breed_name, breed in breeds.items():
            mothers = list(
                Dog.objects.filter(breed=breed, sex=female_sex)
                .exclude(id__in=used_dog_ids)
                .order_by("id")[:6]
            )
            fathers = list(
                Dog.objects.filter(breed=breed, sex=male_sex)
                .exclude(id__in=used_dog_ids)
                .order_by("id")[:6]
            )
            puppies = puppies_by_breed.get(breed_name, [])
            if len(mothers) < len(puppies) or len(fathers) < len(puppies):
                self.stdout.write(
                    self.style.WARNING(
                        f"Порода {breed_name}: недостаточно собак для родителей "
                    )
                )
                continue
            for i, puppy in enumerate(puppies):
                PuppyParents.objects.create(
                    puppy=puppy,
                    dog=mothers[i],
                    role=PuppyParents.ROLE_MOTHER,
                )
                PuppyParents.objects.create(
                    puppy=puppy,
                    dog=fathers[i],
                    role=PuppyParents.ROLE_FATHER,
                )
                used_dog_ids.add(mothers[i].id)
                used_dog_ids.add(fathers[i].id)
                parents_created += 2

        docs_created = 0
        for breed_name in breeds:
            for puppy in puppies_by_breed.get(breed_name, []):
                for doc_name in PUPPY_DOCUMENT_NAMES[:2]:
                    PuppyDocument.objects.create(puppy=puppy, name=doc_name)
                    docs_created += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Создано тестовых щенков: {created}, "
                f"родителей: {parents_created}, документов без файла: {docs_created}."
            )
        )
