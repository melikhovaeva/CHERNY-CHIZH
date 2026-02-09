from django.db import models
from django.utils.text import slugify
from transliterate import translit


class PuppyStatus(models.Model):
    """Справочник статусов щенка."""

    code = models.CharField(max_length=64, unique=True, null=False, blank=False)
    label = models.CharField(max_length=255, null=False, blank=False)

    class Meta:
        verbose_name = "Статус щенка"
        verbose_name_plural = "Статусы щенков"
        ordering = ["code"]

    def __str__(self):
        return self.label


class PuppySex(models.Model):
    """Справочник пола щенка"""

    code = models.CharField(max_length=64, unique=True, null=False, blank=False)
    label = models.CharField(max_length=255, null=False, blank=False)

    class Meta:
        verbose_name = "Пол щенка"
        verbose_name_plural = "Пол щенков"
        ordering = ["code"]

    def __str__(self):
        return self.label


class PuppyPotential(models.Model):
    """Справочник потенциала щенка."""

    code = models.CharField(max_length=64, unique=True, null=False, blank=False)
    label = models.CharField(max_length=255, null=False, blank=False)

    class Meta:
        verbose_name = "Потенциал щенка"
        verbose_name_plural = "Потенциалы щенков"
        ordering = ["code"]

    def __str__(self):
        return self.label


class Breed(models.Model):
    """Порода щенка"""

    name = models.CharField(max_length=255, null=False, blank=False)
    full_name = models.CharField(max_length=255, null=False, blank=False)
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
    """Единая сущность описания породы"""

    breed = models.OneToOneField(
        "Breed",
        on_delete=models.CASCADE,
        related_name="description",
        null=False,
        blank=False,
    )
    appearance = models.TextField(null=False, blank=False)
    character_rating = models.IntegerField(null=False, blank=False)
    character_text = models.TextField(null=False, blank=False)
    adaptability_rating = models.IntegerField(null=False, blank=False)
    adaptability_text = models.TextField(null=False, blank=False)
    care_rating = models.IntegerField(null=False, blank=False)
    care_text = models.TextField(null=False, blank=False)
    activity_rating = models.IntegerField(null=False, blank=False)
    activity_text = models.TextField(null=False, blank=False)

    class Meta:
        verbose_name = "Описание породы"
        verbose_name_plural = "Описания пород"

    def __str__(self):
        return f"Описание: {self.breed.name}"


class Puppy(models.Model):
    """Щенок."""

    name = models.CharField(max_length=255, null=False, blank=False)
    breed = models.ForeignKey(
        Breed,
        on_delete=models.CASCADE,
        related_name="puppies",
        null=False,
        blank=False,
    )
    status = models.ForeignKey(
        PuppyStatus,
        on_delete=models.PROTECT,
        related_name="puppies",
        null=False,
        blank=False,
    )
    birth_date = models.DateField(null=False, blank=False)
    sex = models.ForeignKey(
        PuppySex,
        on_delete=models.PROTECT,
        related_name="puppies",
        null=False,
        blank=False,
    )
    color = models.CharField(max_length=255, null=False, blank=False)
    potential = models.ForeignKey(
        PuppyPotential,
        on_delete=models.PROTECT,
        related_name="puppies",
        null=False,
        blank=False,
    )
    description = models.TextField(null=True, blank=True)

    class Meta:
        verbose_name = "Щенок"
        verbose_name_plural = "Щенки"

    def __str__(self):
        return self.name + " " + self.international_name

    @property
    def international_name(self):
        try:
            return translit(self.name, "ru", reversed=True)
        except Exception:
            return self.name


class PuppyPhoto(models.Model):
    """Фото щенка (many to one)"""

    puppy = models.ForeignKey(
        Puppy,
        on_delete=models.CASCADE,
        related_name="photos",
        null=False,
        blank=False,
    )
    photo = models.ImageField(upload_to="puppies/", null=False, blank=False)
    order = models.PositiveSmallIntegerField(default=0, null=False, blank=False)

    class Meta:
        ordering = ["order", "id"]
        verbose_name = "Фото щенка"
        verbose_name_plural = "Фото щенков"


class PuppyParents(models.Model):
    """Родители щенка (one to one)"""

    puppy = models.OneToOneField(
        "Puppy",
        on_delete=models.CASCADE,
        related_name="parents",
        null=False,
        blank=False,
    )
    mother = models.ForeignKey(
        "Puppy",
        on_delete=models.CASCADE,
        related_name="children_as_mother",
        null=False,
        blank=False,
    )
    father = models.ForeignKey(
        "Puppy",
        on_delete=models.CASCADE,
        related_name="children_as_father",
        null=False,
        blank=False,
    )

    class Meta:
        verbose_name = "Родители щенка"
        verbose_name_plural = "Родители щенков"
