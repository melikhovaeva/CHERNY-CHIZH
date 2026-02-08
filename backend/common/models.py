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
    name = models.CharField(max_length=255)
    full_name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

    @property
    def slug(self) -> str:
        try:
            base = translit(self.name, "ru", reversed=True).lower()
        except Exception:
            base = self.name.lower()
        return slugify(base)

class PuppyStatus(models.TextChoices):
    FOR_SALE = 'for_sale', 'В продаже'
    RESERVED = 'reserved', 'Забронирован'
    SOLD = 'sold', 'Куплен'

class PuppySex(models.TextChoices):
    MALE = 'male', 'Мальчик'
    FEMALE = 'female', 'Девочка'

class PuppyPotential(models.TextChoices):
    HIGH = 'pet', 'Домашний питомец'
    MEDIUM = 'breed', 'Разведение'
    LOW = 'show', 'Шоу'


class Puppy(models.Model):
    name = models.CharField(max_length=255)
    breed = models.ForeignKey(Breed, on_delete=models.CASCADE)
    status = models.CharField(max_length=255, choices=PuppyStatus.choices)
    birth_date = models.DateField()
    sex = models.CharField(max_length=255, choices=PuppySex.choices)
    color = models.CharField(max_length=255)
    potential = models.CharField(max_length=255, choices=PuppyPotential.choices)
    description = models.TextField(blank=True, null=True)


    
    def __str__(self):
        return self.name + " " + self.international_name

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

