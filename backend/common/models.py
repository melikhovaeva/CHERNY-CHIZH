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


# ---------------------------------------------------------------------------
# Enum-справочники для животных
# ---------------------------------------------------------------------------


class DogStatus(models.TextChoices):
    ON_SALE = "on_sale", "В продаже"
    BOOKED = "booked", "Забронирован"
    SOLD = "sold", "Куплен"


class DogSex(models.TextChoices):
    MALE = "male", "Мальчик"
    FEMALE = "female", "Девочка"


class DogPotential(models.TextChoices):
    PET = "pet", "Домашний питомец"
    SHOW = "show", "Шоу"
    BREEDING = "breeding", "Разведение"


class BaseAnimal(TimeStampModel):
    """Общие поля для щенков и взрослых собак."""

    name = models.CharField(max_length=255)
    breed = models.ForeignKey(
        "Breed",
        on_delete=models.CASCADE,
        related_name="%(class)ss",
    )
    status = models.CharField(
        max_length=32,
        choices=DogStatus.choices,
    )
    birth_date = models.DateField()
    sex = models.CharField(
        max_length=16,
        choices=DogSex.choices,
    )
    color = models.CharField(max_length=255)
    potential = models.CharField(
        max_length=32,
        choices=DogPotential.choices,
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

class Dog(BaseAnimal):
    """Собака (щенок или взрослая) в единой таблице."""

    AGE_GROUP_PUPPY = "puppy"
    AGE_GROUP_ADULT = "adult"

    AGE_GROUP_CHOICES = [
        (AGE_GROUP_PUPPY, "Щенок"),
        (AGE_GROUP_ADULT, "Собака"),
    ]

    age_group = models.CharField(
        max_length=16,
        choices=AGE_GROUP_CHOICES,
        default=AGE_GROUP_ADULT,
    )

    class Meta:
        verbose_name = "Собака"
        verbose_name_plural = "Собаки"
        constraints = [
            models.UniqueConstraint(
                fields=["id", "breed"],
                name="dog_id_breed_unique",
            ),
        ]

    def __str__(self):
        return f"{self.name} ({self.age_group == Dog.AGE_GROUP_PUPPY and 'щенок' or 'собака'})"

    @property
    def international_name(self):
        try:
            return translit(self.name, "ru", reversed=True)
        except Exception:
            return self.name


class DogPhoto(models.Model):
    """Фото собаки (включая щенков)."""

    dog = models.ForeignKey(
        Dog,
        on_delete=models.CASCADE,
        related_name="photos",
    )
    photo = models.ImageField(upload_to="dogs/")
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]
        verbose_name = "Фото собаки"
        verbose_name_plural = "Фото собак"


class DogDocument(models.Model):
    """Документ собаки (включая щенков)."""

    dog = models.ForeignKey(
        Dog,
        on_delete=models.CASCADE,
        related_name="documents",
    )
    file = models.FileField(upload_to="dogs/documents/", null=True, blank=True)
    name = models.CharField(max_length=255)

    class Meta:
        verbose_name = "Документ собаки"
        verbose_name_plural = "Документы собак"


class DogParent(models.Model):
    """Связь собаки-ребёнка с родителем-собакой.

    Для щенка-ребёнка родителем может быть только взрослая собака.
    Щенок не может быть родителем. Собака может быть родителем собаки.
    Поле breed денормализовано из Dog и контролируется на совпадение пород.
    """

    ROLE_MOTHER = "mother"
    ROLE_FATHER = "father"

    ROLE_CHOICES = [
        (ROLE_MOTHER, "Мать"),
        (ROLE_FATHER, "Отец"),
    ]

    child = models.ForeignKey(
        Dog,
        on_delete=models.CASCADE,
        related_name="parent_links",
    )
    parent = models.ForeignKey(
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
        verbose_name = "Родитель собаки"
        verbose_name_plural = "Родители собак"
        constraints = [
            models.UniqueConstraint(
                fields=["child", "role"],
                name="unique_role_per_child",
            ),
        ]

    def clean(self):
        super().clean()
        if self.child_id:
            self.breed_id = Dog.objects.filter(
                pk=self.child_id,
            ).values_list("breed_id", flat=True).first()

        parent = None
        if self.parent_id:
            parent = Dog.objects.filter(pk=self.parent_id).values(
                "breed_id",
                "age_group",
            ).first()

        if parent and self.breed_id and parent["breed_id"] != self.breed_id:
            raise ValidationError(
                {
                    "parent": "Порода родителя должна совпадать с породой ребёнка.",
                }
            )

        if parent:
            parent_age_group = parent["age_group"]
            if parent_age_group == Dog.AGE_GROUP_PUPPY:
                raise ValidationError(
                    {
                        "parent": "Щенок не может быть родителем.",
                    }
                )

        child = None
        if self.child_id:
            child = Dog.objects.filter(pk=self.child_id).values("age_group").first()

        if child and child["age_group"] == Dog.AGE_GROUP_PUPPY:
            if not parent or parent["age_group"] != Dog.AGE_GROUP_ADULT:
                raise ValidationError(
                    {
                        "parent": "Родителем щенка может быть только взрослая собака.",
                    }
                )

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)


# ---------------------------------------------------------------------------
# Requests
# ---------------------------------------------------------------------------

class RequestManager(models.Manager):
    """Менеджер для создания и хранения заявок."""

    def create_request(self, *, dog=None, puppy=None, **kwargs):
        """
        Унифицированный метод создания заявки.

        Предпочтительно передавать dog (экземпляр или id).
        Параметр puppy поддерживается для обратной совместимости.
        """
        target = dog if dog is not None else puppy
        if target is not None and not isinstance(target, Dog):
            target = Dog.objects.get(pk=target)
        if target is not None:
            kwargs["dog"] = target
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
    last_name = models.CharField(max_length=255, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=255)
    messenger = models.CharField(max_length=255)
    message = models.TextField()
    dog = models.ForeignKey(
        Dog,
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