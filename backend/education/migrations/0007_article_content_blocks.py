from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("education", "0006_article_content_help_text_html"),
    ]

    operations = [
        migrations.AddField(
            model_name="article",
            name="content_blocks",
            field=models.JSONField(
                blank=True,
                default=list,
                help_text="Блоки контента для редактора. Если непусто — content генерируется из блоков.",
            ),
        ),
    ]
