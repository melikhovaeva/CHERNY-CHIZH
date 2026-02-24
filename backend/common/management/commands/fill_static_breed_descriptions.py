from django.core.management.base import BaseCommand

from common.models import Breed, BreedDescription


BREED_DESCRIPTIONS_BY_NAME = {
    "Шарпей": {
        "appearance": (
            "Уникально выделяется среди пород с грушевидной головой, "
            "морщинистым лицом и ушами-раковинами. Отличается сине-черным языком, "
            "крепким телосложением и мускулистыми ногами. Шарпей украшают широкая "
            "грудь, гибкая спина и кольцеобразный хвост, а его жесткая шерсть "
            "подчеркивает неповторимый стиль."
        ),
        "character_rating": 5,
        "character_text": "Спокойный и уравновешенный компаньон, ориентированный на человека.",
        "adaptability_rating": 3,
        "adaptability_text": (
            "Требует ранней социализации и последовательного воспитания "
            "для комфортного сосуществования."
        ),
        "care_rating": 4,
        "care_text": "Необходим регулярный осмотр складок кожи и поддержание гигиены.",
        "activity_rating": 2,
        "activity_text": (
            "Подходит для спокойных прогулок, комфортно чувствует себя "
            "в домашней обстановке."
        ),
    },
    "Сиба ину": {
        "appearance": (
            "Компактная собака с гармоничным телосложением, лисьей мордой и "
            "стоячими ушами. Густая двойная шерсть с характерным рыжим окрасом "
            "и уражиро."
        ),
        "character_rating": 4,
        "character_text": (
            "Независимый, умный и преданный. Сдержан с незнакомцами, "
            "ласков с семьёй."
        ),
        "adaptability_rating": 3,
        "adaptability_text": (
            "Хорошо адаптируется при ранней социализации и стабильном режиме."
        ),
        "care_rating": 4,
        "care_text": (
            "Обильная линька дважды в год, регулярное расчёсывание обязательно."
        ),
        "activity_rating": 5,
        "activity_text": (
            "Очень активная порода, нужны ежедневные прогулки и умственная нагрузка."
        ),
    },
    "Корги": {
        "appearance": (
            "Коротколапая собака с удлинённым корпусом, большими стоячими ушами "
            "и выразительной мордой. Шерсть средней длины, окрас рыже-белый или триколор."
        ),
        "character_rating": 5,
        "character_text": (
            "Дружелюбный, энергичный и преданный. Отличный компаньон для семьи."
        ),
        "adaptability_rating": 5,
        "adaptability_text": (
            "Отлично уживается в квартире и доме при достаточной активности."
        ),
        "care_rating": 3,
        "care_text": (
            "Регулярное расчёсывание, контроль веса из-за склонности к ожирению."
        ),
        "activity_rating": 4,
        "activity_text": (
            "Нужны регулярные прогулки и игры, несмотря на короткие лапы."
        ),
    },
    "Шпиц": {
        "appearance": (
            "Пушистая собака с густой шерстью, лисьей мордой и закинутым на спину "
            "хвостом. Размер варьируется в зависимости от разновидности."
        ),
        "character_rating": 4,
        "character_text": "Жизнерадостный, преданный и бдительный. Может быть упрямым.",
        "adaptability_rating": 4,
        "adaptability_text": (
            "Хорошо приспосабливается к разным условиям при правильном воспитании."
        ),
        "care_rating": 3,
        "care_text": "Требует регулярного расчёсывания густой шерсти.",
        "activity_rating": 4,
        "activity_text": (
            "Умеренно активная порода, любит прогулки и игры."
        ),
    },
}


DEFAULT_RATING = 3


def _build_fallback_description(breed: Breed) -> dict:
    """Фолбэк-описание для пород, которых нет в словаре выше."""
    name = breed.full_name or breed.name
    return {
        "appearance": f"Описание внешности породы «{name}» будет добавлено позже.",
        "character_rating": DEFAULT_RATING,
        "character_text": (
            f"Информация о характере породы «{name}» будет добавлена позже."
        ),
        "adaptability_rating": DEFAULT_RATING,
        "adaptability_text": (
            f"Информация об адаптивности породы «{name}» будет добавлена позже."
        ),
        "care_rating": DEFAULT_RATING,
        "care_text": (
            f"Информация об уходе за породой «{name}» будет добавлена позже."
        ),
        "activity_rating": DEFAULT_RATING,
        "activity_text": (
            f"Информация об активности породы «{name}» будет добавлена позже."
        ),
    }


def _get_description_payload(breed: Breed) -> dict:
    """Возвращает словарь полей для BreedDescription для конкретной породы."""
    data = BREED_DESCRIPTIONS_BY_NAME.get(breed.name)
    if data is not None:
        return data
    return _build_fallback_description(breed)


class Command(BaseCommand):
    help = "Создаёт или обновляет статические описания для всех пород (модель BreedDescription)."

    def add_arguments(self, parser):
        parser.add_argument(
            "--overwrite",
            action="store_true",
            help="Перезаписывать существующие описания пород.",
        )

    def handle(self, *args, **options):
        overwrite: bool = options["overwrite"]

        created = 0
        updated = 0
        skipped = 0

        for breed in Breed.objects.all():
            payload = _get_description_payload(breed)

            try:
                description = breed.description
            except BreedDescription.DoesNotExist:
                description = None

            if description is None:
                BreedDescription.objects.create(breed=breed, **payload)
                created += 1
                self.stdout.write(
                    self.style.SUCCESS(f"Создано описание для породы: {breed.name}")
                )
                continue

            if not overwrite:
                skipped += 1
                self.stdout.write(
                    self.style.WARNING(
                        f"Пропущено (уже есть описание, без --overwrite): {breed.name}"
                    )
                )
                continue

            for field, value in payload.items():
                setattr(description, field, value)
            description.save()
            updated += 1
            self.stdout.write(
                self.style.SUCCESS(f"Обновлено описание для породы: {breed.name}")
            )

        self.stdout.write(
            self.style.SUCCESS(
                f"Готово. Создано: {created}, обновлено: {updated}, пропущено: {skipped}."
            )
        )

