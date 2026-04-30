import uuid

from django.conf import settings
from django.db import models
from django.utils.text import slugify

from common.models import OrderedCodeLabelModel, OrderedItemModel, TimeStampModel
from education.markdown_utils import blocks_to_html, sanitize_html


class InfoTag(OrderedCodeLabelModel):
    """Справочник тегов для информативного контента (статья, курс)."""

    class Meta(OrderedCodeLabelModel.Meta):
        db_table = "common_infotag"
        verbose_name = "Тег"
        verbose_name_plural = "Теги"


class InfoStatus(models.TextChoices):
    """Предзаданные статусы информативного контента."""

    PUBLISHED = "published", "Опубликован"
    UNPUBLISHED = "unpublished", "Не опубликован"


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
            base_slug = slugify(self.title) or "item"
            slug = base_slug
            model_class = self.__class__
            qs = model_class.objects.filter(slug=slug)
            if self.pk:
                qs = qs.exclude(pk=self.pk)
            while qs.exists():
                slug = f"{base_slug}-{uuid.uuid4().hex[:8]}"
                qs = model_class.objects.filter(slug=slug)
                if self.pk:
                    qs = qs.exclude(pk=self.pk)
            self.slug = slug
        super().save(*args, **kwargs)


class Article(InfoModel):
    """Статья."""

    is_lesson_article = models.BooleanField(
        default=False,
        help_text="True если статья создана автоматически для урока курса.",
    )
    breed = models.OneToOneField(
        "common.Breed",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="article",
    )
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="authored_articles",
    )
    author_text = models.CharField(
        max_length=255,
        blank=True,
        help_text="Текст автора, если автор не пользователь системы",
    )
    status = models.CharField(
        max_length=32,
        choices=InfoStatus.choices,
        default=InfoStatus.UNPUBLISHED,
    )
    tags = models.ManyToManyField(
        InfoTag,
        related_name="articles",
        blank=True,
        db_table="common_article_tags",
    )
    content = models.TextField(
        help_text="HTML-контент статьи (санитизируется при сохранении).",
    )
    content_blocks = models.JSONField(
        default=list,
        blank=True,
        help_text="Блоки контента для редактора. Если непусто — content генерируется из блоков.",
    )

    class Meta:
        db_table = "common_article"
        verbose_name = "Статья"
        verbose_name_plural = "Статьи"

    def save(self, *args, **kwargs):
        if self.content_blocks:
            self.content = blocks_to_html(self.content_blocks)
        else:
            self.content = sanitize_html(self.content or "")
        super().save(*args, **kwargs)


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
    status = models.CharField(
        max_length=32,
        choices=InfoStatus.choices,
        default=InfoStatus.UNPUBLISHED,
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
    is_published = models.BooleanField(default=False)

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


class UserTaskAttempt(TimeStampModel):
    """Ответ пользователя на вопрос задания курса."""

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="task_attempts",
    )
    question = models.ForeignKey(
        CourseTaskQuestion,
        on_delete=models.CASCADE,
        related_name="attempts",
    )
    selected_answer = models.ForeignKey(
        CourseTaskAnswer,
        on_delete=models.CASCADE,
        related_name="attempts",
    )

    class Meta:
        db_table = "education_usertaskattempt"
        unique_together = [("user", "question")]
        verbose_name = "Попытка ответа на задание"
        verbose_name_plural = "Попытки ответов на задания"

