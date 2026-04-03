"""
Создаёт статью о каждой породе для блока «Узнать подробнее» на FE.
Заполняет title, slug (poroda-{breed.slug}), description, content (HTML),
image_preview из test-photos, status=published и связь breed.
"""
from django.core.management.base import BaseCommand

from common.models import Breed
from education.markdown_utils import markdown_to_safe_html
from education.models import Article, InfoStatus

from ._test_photos import assign_photo_from_path, get_photos_by_breed
from .fill_test_breed_descriptions import _get_description_payload


def _build_article_description(payload: dict) -> str:
    """Краткое описание для поля description статьи (один-два предложения)."""
    return payload.get("appearance", "")[:500] or "Подробнее о породе."


def _build_article_markdown(full_name: str, payload: dict) -> str:
    """Промежуточный markdown для конвертации в HTML."""
    appearance = payload.get("appearance", "")
    character = payload.get("character_text", "")
    adaptability = payload.get("adaptability_text", "")
    care = payload.get("care_text", "")
    activity = payload.get("activity_text", "")

    return f"""# О породе {full_name}

{appearance}

## Характер

{character}

## Адаптивность

{adaptability}

## Уход

{care}

## Активность

{activity}
"""


class Command(BaseCommand):
    help = (
        "Создаёт статью о каждой породе (модель Article, связь с Breed). "
        "Используется при заполнении БД тестовыми данными."
    )

    def add_arguments(self, parser):
        parser.add_argument(
            "--overwrite",
            action="store_true",
            help="Перезаписывать существующие статьи (content, description, image_preview).",
        )

    def handle(self, *args, **options):
        overwrite: bool = options["overwrite"]
        photos_by_breed = get_photos_by_breed()

        created = 0
        updated = 0
        skipped = 0

        for breed in Breed.objects.all():
            has_article = hasattr(breed, "article") and breed.article_id is not None

            if has_article and not overwrite:
                skipped += 1
                self.stdout.write(
                    self.style.WARNING(
                        f"Пропущено (уже есть статья, без --overwrite): {breed.name}"
                    )
                )
                continue

            payload = _get_description_payload(breed)
            description = _build_article_description(payload)
            content = markdown_to_safe_html(
                _build_article_markdown(breed.full_name or breed.name, payload)
            )
            slug = f"poroda-{breed.slug}"

            if has_article:
                article = breed.article
                article.title = f"О породе {breed.full_name or breed.name}"
                article.slug = slug
                article.description = description
                article.content = content
                article.status = InfoStatus.PUBLISHED
                article.save()
                updated += 1
                self.stdout.write(
                    self.style.SUCCESS(f"Обновлена статья для породы: {breed.name}")
                )
            else:
                article = Article.objects.create(
                    title=f"О породе {breed.full_name or breed.name}",
                    slug=slug,
                    description=description,
                    content=content,
                    status=InfoStatus.PUBLISHED,
                    breed=breed,
                )
                created += 1
                self.stdout.write(
                    self.style.SUCCESS(f"Создана статья для породы: {breed.name}")
                )

            # image_preview: первое фото породы из test-photos
            breed_photos = photos_by_breed.get(breed.name, [])
            if breed_photos:
                first_photo = breed_photos[0]
                save_name = f"breed_article_{breed.slug}{first_photo.suffix}"
                if assign_photo_from_path(
                    article, "image_preview", first_photo, save_name
                ):
                    article.save()

        self.stdout.write(
            self.style.SUCCESS(
                f"Готово. Создано: {created}, обновлено: {updated}, пропущено: {skipped}."
            )
        )
