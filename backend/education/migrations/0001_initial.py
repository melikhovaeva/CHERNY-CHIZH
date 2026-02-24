from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.SeparateDatabaseAndState(
            database_operations=[],
            state_operations=[
                migrations.CreateModel(
                    name="InfoStatus",
                    fields=[
                        (
                            "id",
                            models.BigAutoField(
                                auto_created=True,
                                primary_key=True,
                                serialize=False,
                                verbose_name="ID",
                            ),
                        ),
                        ("code", models.CharField(max_length=64, unique=True)),
                        ("label", models.CharField(max_length=255)),
                        ("order", models.PositiveSmallIntegerField(default=0)),
                    ],
                    options={
                        "verbose_name": "Статус",
                        "verbose_name_plural": "Статусы",
                        "ordering": ["order", "id"],
                        "abstract": False,
                        "db_table": "common_infostatus",
                    },
                ),
                migrations.CreateModel(
                    name="InfoTag",
                    fields=[
                        (
                            "id",
                            models.BigAutoField(
                                auto_created=True,
                                primary_key=True,
                                serialize=False,
                                verbose_name="ID",
                            ),
                        ),
                        ("code", models.CharField(max_length=64, unique=True)),
                        ("label", models.CharField(max_length=255)),
                        ("order", models.PositiveSmallIntegerField(default=0)),
                    ],
                    options={
                        "verbose_name": "Тег",
                        "verbose_name_plural": "Теги",
                        "ordering": ["order", "id"],
                        "abstract": False,
                        "db_table": "common_infotag",
                    },
                ),
                migrations.CreateModel(
                    name="Article",
                    fields=[
                        (
                            "id",
                            models.BigAutoField(
                                auto_created=True,
                                primary_key=True,
                                serialize=False,
                                verbose_name="ID",
                            ),
                        ),
                        ("created_at", models.DateTimeField(auto_now_add=True)),
                        ("updated_at", models.DateTimeField(auto_now=True)),
                        ("title", models.CharField(max_length=255)),
                        ("slug", models.SlugField(max_length=255, unique=True)),
                        ("description", models.TextField()),
                        (
                            "image_preview",
                            models.ImageField(
                                blank=True,
                                null=True,
                                upload_to="info_models/",
                            ),
                        ),
                        ("content", models.TextField()),
                        (
                            "status",
                            models.ForeignKey(
                                on_delete=django.db.models.deletion.PROTECT,
                                related_name="articles",
                                to="education.infostatus",
                            ),
                        ),
                        (
                            "tags",
                            models.ManyToManyField(
                                blank=True,
                                related_name="articles",
                                to="education.infotag",
                                db_table="common_article_tags",
                            ),
                        ),
                    ],
                    options={
                        "verbose_name": "Статья",
                        "verbose_name_plural": "Статьи",
                        "db_table": "common_article",
                    },
                ),
                migrations.CreateModel(
                    name="Course",
                    fields=[
                        (
                            "id",
                            models.BigAutoField(
                                auto_created=True,
                                primary_key=True,
                                serialize=False,
                                verbose_name="ID",
                            ),
                        ),
                        ("created_at", models.DateTimeField(auto_now_add=True)),
                        ("updated_at", models.DateTimeField(auto_now=True)),
                        ("title", models.CharField(max_length=255)),
                        ("slug", models.SlugField(max_length=255, unique=True)),
                        ("description", models.TextField()),
                        (
                            "image_preview",
                            models.ImageField(
                                blank=True,
                                null=True,
                                upload_to="info_models/",
                            ),
                        ),
                        ("action_text", models.CharField(max_length=26)),
                        (
                            "difficulty",
                            models.CharField(
                                choices=[
                                    ("beginner", "Начинающий"),
                                    ("intermediate", "Средний"),
                                    ("advanced", "Продвинутый"),
                                ],
                                default="beginner",
                                max_length=255,
                            ),
                        ),
                        (
                            "status",
                            models.ForeignKey(
                                on_delete=django.db.models.deletion.PROTECT,
                                related_name="courses",
                                to="education.infostatus",
                            ),
                        ),
                        (
                            "tags",
                            models.ManyToManyField(
                                blank=True,
                                related_name="courses",
                                to="education.infotag",
                                db_table="common_course_tags",
                            ),
                        ),
                    ],
                    options={
                        "db_table": "common_course",
                    },
                ),
                migrations.CreateModel(
                    name="CourseStep",
                    fields=[
                        (
                            "id",
                            models.BigAutoField(
                                auto_created=True,
                                primary_key=True,
                                serialize=False,
                                verbose_name="ID",
                            ),
                        ),
                        ("created_at", models.DateTimeField(auto_now_add=True)),
                        ("updated_at", models.DateTimeField(auto_now=True)),
                        ("order", models.PositiveSmallIntegerField(default=0)),
                        ("title", models.CharField(max_length=255)),
                        (
                            "course",
                            models.ForeignKey(
                                on_delete=django.db.models.deletion.CASCADE,
                                related_name="steps",
                                to="education.course",
                            ),
                        ),
                    ],
                    options={
                        "verbose_name": "Ступень курса",
                        "verbose_name_plural": "Ступени курса",
                        "ordering": ["course", "order", "id"],
                        "abstract": False,
                        "db_table": "common_coursestep",
                    },
                ),
                migrations.CreateModel(
                    name="CourseLesson",
                    fields=[
                        (
                            "id",
                            models.BigAutoField(
                                auto_created=True,
                                primary_key=True,
                                serialize=False,
                                verbose_name="ID",
                            ),
                        ),
                        ("created_at", models.DateTimeField(auto_now_add=True)),
                        ("updated_at", models.DateTimeField(auto_now=True)),
                        ("order", models.PositiveSmallIntegerField(default=0)),
                        ("title", models.CharField(max_length=255)),
                        (
                            "article",
                            models.OneToOneField(
                                blank=True,
                                null=True,
                                on_delete=django.db.models.deletion.CASCADE,
                                related_name="lesson",
                                to="education.article",
                            ),
                        ),
                        (
                            "step",
                            models.ForeignKey(
                                on_delete=django.db.models.deletion.CASCADE,
                                related_name="lessons",
                                to="education.coursestep",
                            ),
                        ),
                    ],
                    options={
                        "verbose_name": "Урок курса",
                        "verbose_name_plural": "Уроки курса",
                        "ordering": ["step", "order", "id"],
                        "abstract": False,
                        "db_table": "common_courselesson",
                    },
                ),
                migrations.CreateModel(
                    name="CourseTask",
                    fields=[
                        (
                            "id",
                            models.BigAutoField(
                                auto_created=True,
                                primary_key=True,
                                serialize=False,
                                verbose_name="ID",
                            ),
                        ),
                        ("created_at", models.DateTimeField(auto_now_add=True)),
                        ("updated_at", models.DateTimeField(auto_now=True)),
                        ("order", models.PositiveSmallIntegerField(default=0)),
                        ("title", models.CharField(max_length=255)),
                        (
                            "description",
                            models.TextField(blank=True, null=True),
                        ),
                        (
                            "lesson",
                            models.ForeignKey(
                                on_delete=django.db.models.deletion.CASCADE,
                                related_name="tasks",
                                to="education.courselesson",
                            ),
                        ),
                    ],
                    options={
                        "verbose_name": "Задание курса",
                        "verbose_name_plural": "Задания курса",
                        "ordering": ["lesson", "order", "id"],
                        "abstract": False,
                        "db_table": "common_coursetask",
                    },
                ),
                migrations.CreateModel(
                    name="CourseTaskQuestion",
                    fields=[
                        (
                            "id",
                            models.BigAutoField(
                                auto_created=True,
                                primary_key=True,
                                serialize=False,
                                verbose_name="ID",
                            ),
                        ),
                        ("created_at", models.DateTimeField(auto_now_add=True)),
                        ("updated_at", models.DateTimeField(auto_now=True)),
                        ("order", models.PositiveSmallIntegerField(default=0)),
                        ("text", models.TextField()),
                        (
                            "task",
                            models.ForeignKey(
                                on_delete=django.db.models.deletion.CASCADE,
                                related_name="questions",
                                to="education.coursetask",
                            ),
                        ),
                    ],
                    options={
                        "verbose_name": "Вопрос задания курса",
                        "verbose_name_plural": "Вопросы заданий курса",
                        "ordering": ["task", "order", "id"],
                        "abstract": False,
                        "db_table": "common_coursetaskquestion",
                    },
                ),
                migrations.CreateModel(
                    name="CourseTaskAnswer",
                    fields=[
                        (
                            "id",
                            models.BigAutoField(
                                auto_created=True,
                                primary_key=True,
                                serialize=False,
                                verbose_name="ID",
                            ),
                        ),
                        ("created_at", models.DateTimeField(auto_now_add=True)),
                        ("updated_at", models.DateTimeField(auto_now=True)),
                        ("order", models.PositiveSmallIntegerField(default=0)),
                        ("text", models.CharField(max_length=255)),
                        (
                            "is_correct",
                            models.BooleanField(default=False),
                        ),
                        (
                            "question",
                            models.ForeignKey(
                                on_delete=django.db.models.deletion.CASCADE,
                                related_name="answers",
                                to="education.coursetaskquestion",
                            ),
                        ),
                    ],
                    options={
                        "verbose_name": "Вариант ответа задания курса",
                        "verbose_name_plural": "Варианты ответов заданий курса",
                        "ordering": ["question", "order", "id"],
                        "abstract": False,
                        "db_table": "common_coursetaskanswer",
                    },
                ),
                migrations.CreateModel(
                    name="CourseEnrollment",
                    fields=[
                        (
                            "id",
                            models.BigAutoField(
                                auto_created=True,
                                primary_key=True,
                                serialize=False,
                                verbose_name="ID",
                            ),
                        ),
                        ("created_at", models.DateTimeField(auto_now_add=True)),
                        ("updated_at", models.DateTimeField(auto_now=True)),
                        (
                            "status",
                            models.CharField(
                                choices=[
                                    ("enrolled", "Записан"),
                                    ("completed", "Завершен"),
                                    ("cancelled", "Отменен"),
                                ],
                                default="enrolled",
                                max_length=32,
                            ),
                        ),
                        (
                            "progress",
                            models.PositiveSmallIntegerField(
                                blank=True,
                                help_text="Прогресс прохождения курса в процентах",
                                null=True,
                            ),
                        ),
                        ("started_at", models.DateTimeField(blank=True, null=True)),
                        ("completed_at", models.DateTimeField(blank=True, null=True)),
                        (
                            "course",
                            models.ForeignKey(
                                on_delete=django.db.models.deletion.CASCADE,
                                related_name="enrollments",
                                to="education.course",
                            ),
                        ),
                        (
                            "user",
                            models.ForeignKey(
                                on_delete=django.db.models.deletion.CASCADE,
                                related_name="course_enrollments",
                                to=settings.AUTH_USER_MODEL,
                            ),
                        ),
                    ],
                    options={
                        "verbose_name": "Запись на курс",
                        "verbose_name_plural": "Записи на курсы",
                        "db_table": "common_courseenrollment",
                        "unique_together": {("user", "course")},
                    },
                ),
            ],
        ),
    ]

