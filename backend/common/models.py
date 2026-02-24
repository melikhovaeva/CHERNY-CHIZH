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

# ---------------------------------------------------------------------------
# Course hierarchy
# ---------------------------------------------------------------------------
