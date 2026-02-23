from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models
from django.utils.text import slugify
from transliterate import translit


# ---------------------------------------------------------------------------
# Abstract base models
# ---------------------------------------------------------------------------

class TimeStampModel(models.Model):
    """Базовая модель с временными метками."""

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class CodeLabelModel(models.Model):
    """Базовая модель для справочников с полями code и label."""

    code = models.CharField(max_length=64, unique=True)
    label = models.CharField(max_length=255)

    class Meta:
        abstract = True
        ordering = ["code"]

    def __str__(self):
        return self.label


class OrderedCodeLabelModel(CodeLabelModel):
    """Справочник с дополнительным полем сортировки."""

    order = models.PositiveSmallIntegerField(default=0)

    class Meta(CodeLabelModel.Meta):
        abstract = True
        ordering = ["order", "id"]


class BaseAnimal(TimeStampModel):
    """Общие поля для щенков и взрослых собак."""

    name = models.CharField(max_length=255)
    breed = models.ForeignKey(
        "Breed",
        on_delete=models.CASCADE,
        related_name="%(class)ss",
    )
    status = models.ForeignKey(
        "AnimalStatus",
        on_delete=models.PROTECT,
        related_name="%(class)ss",
    )
    birth_date = models.DateField()
    sex = models.ForeignKey(
        "AnimalSex",
        on_delete=models.PROTECT,
        related_name="%(class)ss",
    )
    color = models.CharField(max_length=255)
    potential = models.ForeignKey(
        "AnimalPotential",
        on_delete=models.PROTECT,
        related_name="%(class)ss",
    )
    description = models.TextField(null=True, blank=True)

    class Meta(TimeStampModel.Meta):
        abstract = True

    def __str__(self):
        return self.name


class OrderedItemModel(TimeStampModel):
    """Базовая модель для упорядоченных дочерних элементов."""

    order = models.PositiveSmallIntegerField(default=0)

    class Meta(TimeStampModel.Meta):
        abstract = True


# ---------------------------------------------------------------------------
# Lookup / reference models
# ---------------------------------------------------------------------------

class AnimalStatus(CodeLabelModel):
    """Справочник статусов животного."""

    class Meta(CodeLabelModel.Meta):
        verbose_name = "Статус животного"
        verbose_name_plural = "Статусы животных"


class AnimalSex(CodeLabelModel):
    """Справочник пола животного."""

    class Meta(CodeLabelModel.Meta):
        verbose_name = "Пол животного"
        verbose_name_plural = "Пол животных"


class AnimalPotential(CodeLabelModel):
    """Справочник потенциала животного."""

    class Meta(CodeLabelModel.Meta):
        verbose_name = "Потенциал животного"
        verbose_name_plural = "Потенциалы животных"


class InfoTag(OrderedCodeLabelModel):
    """Справочник тегов для информативного контента (статья, курс)."""

    class Meta(OrderedCodeLabelModel.Meta):
        verbose_name = "Тег"
        verbose_name_plural = "Теги"


class InfoStatus(OrderedCodeLabelModel):
    """Справочник статусов информативного контента (статья, курс)."""

    class Meta(OrderedCodeLabelModel.Meta):
        verbose_name = "Статус"
        verbose_name_plural = "Статусы"


# ---------------------------------------------------------------------------
# Breed
# ---------------------------------------------------------------------------

class Breed(models.Model):
    """Порода."""

    name = models.CharField(max_length=255)
    full_name = models.CharField(max_length=255)
    photo = models.ImageField(upload_to="breeds/", null=True, blank=True)

    class Meta:
        verbose_name = "Порода"
        verbose_name_plural = "Породы"

    def __str__(self):
        return self.name

    @property
    def slug(self) -> str:
        try:
            base = translit(self.name, "ru", reversed=True).lower()
        except Exception:
            base = self.name.lower()
        return slugify(base)


class BreedDescription(models.Model):
    """Единая сущность описания породы."""

    breed = models.OneToOneField(
        Breed,
        on_delete=models.CASCADE,
        related_name="description",
    )
    appearance = models.TextField()
    character_rating = models.IntegerField()
    character_text = models.TextField()
    adaptability_rating = models.IntegerField()
    adaptability_text = models.TextField()
    care_rating = models.IntegerField()
    care_text = models.TextField()
    activity_rating = models.IntegerField()
    activity_text = models.TextField()

    class Meta:
        verbose_name = "Описание породы"
        verbose_name_plural = "Описания пород"

    def __str__(self):
        return f"Описание: {self.breed.name}"


# ---------------------------------------------------------------------------
# Animals
# ---------------------------------------------------------------------------

class Puppy(BaseAnimal):
    """Щенок."""

    class Meta:
        verbose_name = "Щенок"
        verbose_name_plural = "Щенки"
        constraints = [
            models.UniqueConstraint(
                fields=["id", "breed"],
                name="puppy_id_breed_unique",
            ),
        ]

    def __str__(self):
        return f"{self.name} {self.international_name}"

    @property
    def international_name(self):
        try:
            return translit(self.name, "ru", reversed=True)
        except Exception:
            return self.name


class PuppyPhoto(models.Model):
    """Фото щенка."""

    puppy = models.ForeignKey(
        Puppy,
        on_delete=models.CASCADE,
        related_name="photos",
    )
    photo = models.ImageField(upload_to="puppies/")
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]
        verbose_name = "Фото щенка"
        verbose_name_plural = "Фото щенков"


class PuppyDocument(models.Model):
    """Документ щенка."""

    puppy = models.ForeignKey(
        Puppy,
        on_delete=models.CASCADE,
        related_name="documents",
    )
    file = models.FileField(upload_to="puppies/documents/", null=True, blank=True)
    name = models.CharField(max_length=255)

    class Meta:
        verbose_name = "Документ щенка"
        verbose_name_plural = "Документы щенков"


class Dog(BaseAnimal):
    """Взрослая собака."""

    class Meta:
        verbose_name = "Собака"
        verbose_name_plural = "Собаки"
        constraints = [
            models.UniqueConstraint(
                fields=["id", "breed"],
                name="dog_id_breed_unique",
            ),
        ]


class PuppyParents(models.Model):
    """Связь щенка с родителем-собакой.

    Поле breed денормализовано из Puppy/Dog и защищено композитными FK
    на уровне БД (см. миграцию RunSQL), что гарантирует совпадение пород.
    """

    ROLE_MOTHER = "mother"
    ROLE_FATHER = "father"

    ROLE_CHOICES = [
        (ROLE_MOTHER, "Мать"),
        (ROLE_FATHER, "Отец"),
    ]

    puppy = models.ForeignKey(
        Puppy,
        on_delete=models.CASCADE,
        related_name="parent_links",
    )
    dog = models.ForeignKey(
        Dog,
        on_delete=models.CASCADE,
        related_name="children",
    )
    breed = models.ForeignKey(
        Breed,
        on_delete=models.CASCADE,
        related_name="+",
        verbose_name="Порода",
        editable=False,
    )
    role = models.CharField(
        max_length=16,
        choices=ROLE_CHOICES,
    )

    class Meta:
        verbose_name = "Родитель щенка"
        verbose_name_plural = "Родители щенков"
        constraints = [
            models.UniqueConstraint(
                fields=["dog"],
                name="unique_dog_as_parent",
            ),
            models.UniqueConstraint(
                fields=["puppy", "role"],
                name="unique_role_per_puppy",
            ),
        ]

    def clean(self):
        super().clean()
        if self.puppy_id:
            self.breed_id = Puppy.objects.filter(
                pk=self.puppy_id,
            ).values_list("breed_id", flat=True).first()
        if self.dog_id and self.breed_id:
            dog_breed = Dog.objects.filter(
                pk=self.dog_id,
            ).values_list("breed_id", flat=True).first()
            if dog_breed and self.breed_id != dog_breed:
                raise ValidationError({
                    "dog": "Порода собаки-родителя должна совпадать с породой щенка.",
                })

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)


# ---------------------------------------------------------------------------
# Requests
# ---------------------------------------------------------------------------

class RequestManager(models.Manager):
    """Менеджер для создания и хранения заявок."""

    def create_request(self, *, puppy=None, **kwargs):
        if puppy is not None and not isinstance(puppy, Puppy):
            puppy = Puppy.objects.get(pk=puppy)
        if puppy is not None:
            kwargs["puppy"] = puppy
        return self.create(**kwargs)


class Request(models.Model):
    """Заявка на щенка или вопрос общего характера."""

    objects = RequestManager()

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        related_name="requests",
        null=True,
        blank=True,
    )
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=255)
    messenger = models.CharField(max_length=255)
    message = models.TextField()
    puppy = models.ForeignKey(
        Puppy,
        on_delete=models.CASCADE,
        related_name="requests",
        null=True,
        blank=True,
    )

    class Meta:
        verbose_name = "Заявка"
        verbose_name_plural = "Заявки"

    def __str__(self):
        if self.user:
            return f"Заявка #{self.pk} от {self.user.email}"
        return f"Заявка #{self.pk} от {self.first_name} {self.last_name}"


# ---------------------------------------------------------------------------
# Info content
# ---------------------------------------------------------------------------

class InfoModel(TimeStampModel):
    """Базовая модель для информативного контента (статья, курс)."""

    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    description = models.TextField()
    image_preview = models.ImageField(upload_to="info_models/", null=True, blank=True)

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
    tags = models.ManyToManyField(InfoTag, related_name="articles", blank=True)
    content = models.TextField()

    class Meta:
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
    tags = models.ManyToManyField(InfoTag, related_name="courses", blank=True)


# ---------------------------------------------------------------------------
# Course hierarchy
# ---------------------------------------------------------------------------

class CourseStep(OrderedItemModel):
    """Ступень курса."""

    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name="steps",
    )
    title = models.CharField(max_length=255)

    class Meta(OrderedItemModel.Meta):
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
        unique_together = ("user", "course")
        verbose_name = "Запись на курс"
        verbose_name_plural = "Записи на курсы"
