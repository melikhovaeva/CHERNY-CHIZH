import random
from datetime import date, timedelta

from django.core.management.base import BaseCommand, CommandError

from common.models import (
    DogPotential,
    DogSex,
    DogStatus,
    Breed,
    Dog,
    DogDocument,
    DogParent,
    DogPhoto,
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


DESCRIPTIONS_FEMALE = [
    # Девочка, вариант 1
    "{name} — очаровательная и гармонично сложенная девочка с выразительным взглядом и правильным породным типом. С раннего возраста демонстрирует уверенность, любознательность и отличный контакт с человеком. По характеру ласковая, уравновешенная, ориентированная на семью. Быстро адаптируется к новым условиям, хорошо реагирует на внимание и обучение. Подойдёт как для выставочной карьеры, так и в качестве преданного компаньона. Обладает шоу-потенциалом, корректной анатомией и породным темпераментом. Выращивается с заботой, социализируется по возрасту, готова к переезду в новый дом.",
    # Девочка, вариант 2
    "{name} — стильная и очень ласковая девочка с прекрасными породными пропорциями и добрым взглядом. С раннего детства общительная, быстро учится новому, проявляет самостоятельность. Заботливая и спокойная, отлично ладит с детьми и другими питомцами. Подходит для активной семьи или выставочной карьеры. Хорошо социализирована, получает достойный уход и воспитание, полностью готова к переезду.",
    # Девочка, вариант 3
    "{name} — энергичная и игривая девочка с выразительной мимикой и отличной социализацией. Быстро идёт на контакт, любит быть в центре внимания и с радостью участвует в занятиях и играх. Прекрасно адаптируется к новым условиям, подходит для семей с детьми и для опытных хозяев. Имеет перспективу для шоу, отлично воспитана, готова стать частью новой семьи.",
    # Девочка, вариант 4
    "{name} — заботливая и очень преданная девочка с мягким характером и эффектным внешним видом. Склонна к дрессировке, с удовольствием учится и реагирует на новые команды. Легко уживается с другими животными, открыта для общения с людьми. Подходит для активной жизни и дружбы с детьми. Растёт в любви и уходе, полностью социализирована.",
    # Универсальный для девочек (можно немного изменить для естественности)
    "{name} — сбалансированная, умная и очень обаятельная девочка с выраженным породным типом и отличным характером. Быстро устанавливает контакт с людьми и другими животными, легко обучается, подходит для семей с детьми или для выставочной карьеры. Выращивается с заботой, социализирована, готова стать лучшим другом!",
    "{name} — дружелюбная, жизнерадостная и послушная девочка с гармоничной внешностью и крепким здоровьем. Любит исследовать мир, хорошо реагирует на новые впечатления, подходит как для городской квартиры, так и для загородного дома. Правильная социализация, отличная воспитанность, готова к встрече со своими новыми владельцами."
]

DESCRIPTIONS_MALE = [
    # Мальчик, вариант 1
    "{name} — крепкий и уравновешенный мальчик с отличной анатомией и выразительным темпераментом. С раннего возраста проявляет лидерские качества, очень ориентирован на человека и легко обучается. Дружелюбен, прекрасно общается с детьми, любознателен и активен. Идеален для выставочной карьеры или в роли верного домашнего друга. Социализирован, растёт в заботе, полностью готов сменить дом.",
    # Мальчик, вариант 2
    "{name} — очаровательный и гармонично сложенный мальчик с шёлковистой шерстью и ярко выраженным породным типом. Очень ласковый, хорошо идёт на контакт, быстро адаптируется к новому. Обладает перспективой для шоу и отличный компаньон для всей семьи. Воспитан в любви, социализирован, готов к встрече с новыми хозяевами.",
    # Мальчик, вариант 3
    "{name} — весёлый и жизнерадостный мальчик с устойчивой психикой и выраженным чувством доверия к человеку. Быстро обучается, любознателен, проявляет заботу к окружающим и отлично ведёт себя в обществе других собак. Благодаря сбалансированному темпераменту подходит для любой семьи. Привык к уходу и общению, готов начать новую жизнь.",
    # Мальчик, вариант 4
    "{name} — умный, уверенный в себе мальчик с отличной социализацией и выраженной тягой к обучению. Энергичный, игривый и открытый щенок, прекрасно приспосабливается к разным условиям и с радостью находит общий язык с детьми. Хорошо дрессируется, растёт в любви и заботе, готов стать верным спутником.",
    # Универсальный для мальчиков
    "{name} — сбалансированный, умный и очень обаятельный мальчик с выраженным породным типом и отличным характером. Быстро устанавливает контакт с людьми и другими животными, легко обучается, подходит для семей с детьми или для выставочной карьеры. Выращивается с заботой, социализирован, готов стать лучшим другом!",
    "{name} — дружелюбный, жизнерадостный и послушный мальчик с гармоничной внешностью и крепким здоровьем. Любит исследовать мир, хорошо реагирует на новые впечатления, подходит как для городской квартиры, так и для загородного дома. Правильная социализация, отличная воспитанность, готов к встрече со своими новыми владельцами."
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
            deleted, _ = Dog.objects.filter(age_group=Dog.AGE_GROUP_PUPPY).delete()
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
                sex = random.choice(sexes)
                if sex == female_sex:
                    desc_template = random.choice(DESCRIPTIONS_FEMALE)
                else:
                    desc_template = random.choice(DESCRIPTIONS_MALE)
                puppy = Dog.objects.create(
                    name=name,
                    breed=breed,
                    age_group=Dog.AGE_GROUP_PUPPY,
                    status=random.choice(statuses),
                    birth_date=birth_date,
                    sex=sex,
                    color=random.choice(COLORS),
                    potential=random.choice(potentials),
                    description=desc_template.format(name=name),
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
                        pp = DogPhoto(dog=puppy, order=order)
                        assign_photo_from_path(
                            pp,
                            "photo",
                            photo_path,
                            f"dogs/{puppy.id}_{order}_{photo_path.name}",
                        )

        parents_created = 0
        used_dog_ids = set(DogParent.objects.values_list("parent_id", flat=True))
        for breed_name, breed in breeds.items():
            mothers = list(
                Dog.objects.filter(
                    breed=breed,
                    sex=female_sex,
                    age_group=Dog.AGE_GROUP_ADULT,
                )
                .exclude(id__in=used_dog_ids)
                .order_by("id")[:6]
            )
            fathers = list(
                Dog.objects.filter(
                    breed=breed,
                    sex=male_sex,
                    age_group=Dog.AGE_GROUP_ADULT,
                )
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
                DogParent.objects.create(
                    child=puppy,
                    parent=mothers[i],
                    role=DogParent.ROLE_MOTHER,
                )
                DogParent.objects.create(
                    child=puppy,
                    parent=fathers[i],
                    role=DogParent.ROLE_FATHER,
                )
                used_dog_ids.add(mothers[i].id)
                used_dog_ids.add(fathers[i].id)
                parents_created += 2

        docs_created = 0
        for breed_name in breeds:
            for puppy in puppies_by_breed.get(breed_name, []):
                for doc_name in PUPPY_DOCUMENT_NAMES[:2]:
                    DogDocument.objects.create(dog=puppy, name=doc_name)
                    docs_created += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Создано тестовых щенков: {created}, "
                f"родителей: {parents_created}, документов без файла: {docs_created}."
            )
        )
