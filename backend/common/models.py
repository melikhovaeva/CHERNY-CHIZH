from django.conf import settings
from django.core.exceptions import ValidationError
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


class PuppyDocument(models.Model):
    """Документ щенка"""

    puppy = models.ForeignKey(
        Puppy,
        on_delete=models.CASCADE,
        related_name="documents",
        null=False,
        blank=False,
    )
    file = models.FileField(upload_to="puppies/documents/", null=True, blank=True)
    name = models.CharField(max_length=255, null=False, blank=False)

    class Meta:
        verbose_name = "Документ щенка"
        verbose_name_plural = "Документы щенков"


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

    def clean(self):
        super().clean()
        if not self.puppy or not self.mother or not self.father:
            return
        if self.puppy and self.mother and (self.puppy is self.mother or (self.puppy.pk and self.mother.pk and self.puppy.pk == self.mother.pk)):
            raise ValidationError(
                {"mother": "Собака не может быть родителем сама себе"}
            )
        if self.puppy and self.father and (self.puppy is self.father or (self.puppy.pk and self.father.pk and self.puppy.pk == self.father.pk)):
            raise ValidationError(
                {"father": "Собака не может быть родителем сама себе"}
            )
        if self.mother.breed_id != self.puppy.breed_id:
            raise ValidationError(
                {"mother": "Мать должна быть той же породы, что и щенок"}
            )
        if self.father.breed_id != self.puppy.breed_id:
            raise ValidationError(
                {"father": "Отец должен быть той же породы, что и щенок"}
            )
        if PuppyParents.objects.filter(mother=self.mother).exclude(puppy=self.puppy).exists():
            raise ValidationError(
                {"mother": "Эта собака уже является родителем другого щенка"}
            )
        if PuppyParents.objects.filter(father=self.father).exclude(puppy=self.puppy).exists():
            raise ValidationError(
                {"father": "Эта собака уже является родителем другого щенка"}
            )


class RequestManager(models.Manager):
    """Менеджер для создания и хранения заявок."""

    def create_request(self, *, puppy=None, **kwargs):
        if puppy is not None and not isinstance(puppy, Puppy):
            puppy = Puppy.objects.get(pk=puppy)
        if puppy is not None:
            kwargs["puppy"] = puppy
        return self.create(**kwargs)


class Request(models.Model):
    """Сущность заявок на щенка или вопросов общего характера если щенок не указан"""
    objects = RequestManager()
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        related_name="requests",
        null=True,
        blank=True,
    )
    first_name = models.CharField(max_length=255, null=False, blank=False)
    last_name = models.CharField(max_length=255, null=False, blank=False)
    email = models.EmailField(null=False, blank=False)
    phone = models.CharField(max_length=255, null=False, blank=False)
    messenger = models.CharField(max_length=255, null=False, blank=False)
    message = models.TextField(null=False, blank=False)
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