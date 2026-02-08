from django.db import models
from django.utils.text import slugify
from transliterate import translit


class BreedDescription(models.Model):
    """Единая сущность описания породы: обязательна для породы, все поля обязательные."""

    breed = models.OneToOneField(
        "Breed",
        on_delete=models.CASCADE,
        related_name="description",
        null=False,
        blank=False,
    )
    appearance = models.TextField()

    # Блоки «интерфейс»: рейтинг + текст (character, adaptability, care, activity)
    character_rating = models.IntegerField()
    character_text = models.TextField()
    adaptability_rating = models.IntegerField()
    adaptability_text = models.TextField()
    care_rating = models.IntegerField()
    care_text = models.TextField()
    activity_rating = models.IntegerField()
    activity_text = models.TextField()


class Breed(models.Model):
    """Порода щенка."""
    name = models.CharField(max_length=255)
    full_name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Порода"
        verbose_name_plural = "Породы"

    @property
    def slug(self) -> str:
        try:
            base = translit(self.name, "ru", reversed=True).lower()
        except Exception:
            base = self.name.lower()
        return slugify(base)

class PuppyStatus(models.Model):
    """Справочник статусов щенка."""
    code = models.CharField(max_length=64, unique=True)
    label = models.CharField(max_length=255)

    class Meta:
        verbose_name = "Статус щенка"
        verbose_name_plural = "Статусы щенков"

    def __str__(self):
        return self.label


class PuppySex(models.Model):
    """Справочник пола щенка."""
    code = models.CharField(max_length=64, unique=True)
    label = models.CharField(max_length=255)

    class Meta:
        verbose_name = "Пол щенка"
        verbose_name_plural = "Пол щенков"

    def __str__(self):
        return self.label


class PuppyPotential(models.Model):
    """Справочник потенциала щенка."""
    code = models.CharField(max_length=64, unique=True)
    label = models.CharField(max_length=255)

    class Meta:
        verbose_name = "Потенциал щенка"
        verbose_name_plural = "Потенциалы щенков"

    def __str__(self):
        return self.label


class Puppy(models.Model):
    """Щенок."""
    name = models.CharField(max_length=255)
    breed = models.ForeignKey(Breed, on_delete=models.CASCADE)
    status = models.ForeignKey(
        PuppyStatus,
        on_delete=models.PROTECT,
        related_name="puppies",
    )
    birth_date = models.DateField()
    sex = models.ForeignKey(
        PuppySex,
        on_delete=models.PROTECT,
        related_name="puppies",
    )
    color = models.CharField(max_length=255)
    potential = models.ForeignKey(
        PuppyPotential,
        on_delete=models.PROTECT,
        related_name="puppies",
    )
    description = models.TextField(blank=True, null=True)


    
    def __str__(self):
        return self.name + " " + self.international_name

    class Meta:
        verbose_name = "Щенок"
        verbose_name_plural = "Щенки"

    @property
    def international_name(self):
        try:
            return translit(self.name, "ru", reversed=True)
        except Exception:
            return self.name


class PuppyParents(models.Model):
    puppy = models.OneToOneField(
        "Puppy",
        on_delete=models.CASCADE,
        related_name="parents",
    )
    mother = models.ForeignKey(
        "Puppy",
        on_delete=models.CASCADE,
        related_name="children_as_mother",
    )
    father = models.ForeignKey(
        "Puppy",
        on_delete=models.CASCADE,
        related_name="children_as_father",
    )

