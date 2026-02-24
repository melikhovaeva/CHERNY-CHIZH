from django.conf import settings
from django.db import models
from django.utils.text import slugify

from common.models import OrderedCodeLabelModel, OrderedItemModel, TimeStampModel


class InfoTag(OrderedCodeLabelModel):
    """Справочник тегов для информативного контента (статья, курс)."""

    class Meta(OrderedCodeLabelModel.Meta):
        db_table = "common_infotag"
        verbose_name = "Тег"
        verbose_name_plural = "Теги"


class InfoStatus(OrderedCodeLabelModel):
    """Справочник статусов информативного контента (статья, курс)."""

    class Meta(OrderedCodeLabelModel.Meta):
        db_table = "common_infostatus"
        verbose_name = "Статус"
        verbose_name_plural = "Статусы"


class InfoModel(TimeStampModel):
    """Базовая модель для информативного контента (статья, курс)."""

    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    description = models.TextField()
    image_preview = models.ImageField(
        upload_to="info_models/",
        null=True,
        blank=True,
    )

    class Meta:
        abstract = True

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)


class Article(InfoModel):
    """Статья."""

    status = models.ForeignKey(
        InfoStatus,
        on_delete=models.PROTECT,
        related_name="articles",
    )
    tags = models.ManyToManyField(
        InfoTag,
        related_name="articles",
        blank=True,
        db_table="common_article_tags",
    )
    content = models.TextField()

    class Meta:
        db_table = "common_article"
        verbose_name = "Статья"
        verbose_name_plural = "Статьи"


class Course(InfoModel):
    """Курс."""

    CHOICES_DIFFICULTY = [
        ("beginner", "Начинающий"),
        ("intermediate", "Средний"),
        ("advanced", "Продвинутый"),
    ]

    action_text = models.CharField(max_length=26)
    difficulty = models.CharField(
        max_length=255,
        choices=CHOICES_DIFFICULTY,
        default="beginner",
    )
    status = models.ForeignKey(
        InfoStatus,
        on_delete=models.PROTECT,
        related_name="courses",
    )
    tags = models.ManyToManyField(
        InfoTag,
        related_name="courses",
        blank=True,
        db_table="common_course_tags",
    )

    class Meta:
        db_table = "common_course"


class CourseStep(OrderedItemModel):
    """Ступень курса."""

    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name="steps",
    )
    title = models.CharField(max_length=255)

    class Meta(OrderedItemModel.Meta):
        db_table = "common_coursestep"
        ordering = ["course", "order", "id"]
        verbose_name = "Ступень курса"
        verbose_name_plural = "Ступени курса"


class CourseLesson(OrderedItemModel):
    """Урок в ступени курса."""

    step = models.ForeignKey(
        CourseStep,
        on_delete=models.CASCADE,
        related_name="lessons",
    )
    article = models.OneToOneField(
        Article,
        on_delete=models.CASCADE,
        related_name="lesson",
        null=True,
        blank=True,
    )
    title = models.CharField(max_length=255)

    class Meta(OrderedItemModel.Meta):
        db_table = "common_courselesson"
        ordering = ["step", "order", "id"]
        verbose_name = "Урок курса"
        verbose_name_plural = "Уроки курса"


class CourseTask(OrderedItemModel):
    """Задание в уроке курса."""

    lesson = models.ForeignKey(
        CourseLesson,
        on_delete=models.CASCADE,
        related_name="tasks",
    )
    title = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)

    class Meta(OrderedItemModel.Meta):
        db_table = "common_coursetask"
        ordering = ["lesson", "order", "id"]
        verbose_name = "Задание курса"
        verbose_name_plural = "Задания курса"


class CourseTaskQuestion(OrderedItemModel):
    """Вопрос задания курса."""

    task = models.ForeignKey(
        CourseTask,
        on_delete=models.CASCADE,
        related_name="questions",
    )
    text = models.TextField()

    class Meta(OrderedItemModel.Meta):
        db_table = "common_coursetaskquestion"
        ordering = ["task", "order", "id"]
        verbose_name = "Вопрос задания курса"
        verbose_name_plural = "Вопросы заданий курса"


class CourseTaskAnswer(OrderedItemModel):
    """Вариант ответа задания курса."""

    question = models.ForeignKey(
        CourseTaskQuestion,
        on_delete=models.CASCADE,
        related_name="answers",
    )
    text = models.CharField(max_length=255)
    is_correct = models.BooleanField(default=False)

    class Meta(OrderedItemModel.Meta):
        db_table = "common_coursetaskanswer"
        ordering = ["question", "order", "id"]
        verbose_name = "Вариант ответа задания курса"
        verbose_name_plural = "Варианты ответов заданий курса"


class CourseEnrollment(TimeStampModel):
    """Запись пользователя на курс."""

    ENROLLMENT_STATUS_CHOICES = [
        ("enrolled", "Записан"),
        ("completed", "Завершен"),
        ("cancelled", "Отменен"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="course_enrollments",
    )
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name="enrollments",
    )
    status = models.CharField(
        max_length=32,
        choices=ENROLLMENT_STATUS_CHOICES,
        default="enrolled",
    )
    progress = models.PositiveSmallIntegerField(
        null=True,
        blank=True,
        help_text="Прогресс прохождения курса в процентах",
    )
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "common_courseenrollment"
        unique_together = ("user", "course")
        verbose_name = "Запись на курс"
        verbose_name_plural = "Записи на курсы"

