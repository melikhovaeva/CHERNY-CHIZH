import re
from django.db import migrations


def mark_lesson_articles(apps, schema_editor):
    Article = apps.get_model("education", "Article")
    CourseLesson = apps.get_model("education", "CourseLesson")

    # Articles currently linked to a lesson
    linked_ids = set(
        CourseLesson.objects.filter(article__isnull=False)
        .values_list("article_id", flat=True)
    )

    # Orphaned lesson articles: slug ends with -{8 hex chars}
    # (auto-generated when lesson title slugifies to an existing slug)
    orphan_pattern = re.compile(r"^.+-[0-9a-f]{8}$")
    orphan_ids = set(
        Article.objects.filter(
            is_lesson_article=False,
            breed__isnull=True,
        )
        .values_list("id", "slug")
        .__iter__()
    )
    orphan_ids = {
        article_id
        for article_id, slug in Article.objects.filter(
            is_lesson_article=False, breed__isnull=True
        ).values_list("id", "slug")
        if orphan_pattern.match(slug)
    }

    all_lesson_ids = linked_ids | orphan_ids
    if all_lesson_ids:
        Article.objects.filter(id__in=all_lesson_ids).update(is_lesson_article=True)


class Migration(migrations.Migration):
    dependencies = [
        ("education", "0010_article_is_lesson_article"),
    ]

    operations = [
        migrations.RunPython(mark_lesson_articles, migrations.RunPython.noop),
    ]
