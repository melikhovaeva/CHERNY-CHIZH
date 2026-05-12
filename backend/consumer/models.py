from django.db import models


class FAQItem(models.Model):
    """Часто задаваемый вопрос."""

    class Category(models.TextChoices):
        GENERAL = "general", "Общие вопросы"
        DELIVERY = "delivery", "Доставка"

    category = models.CharField(
        max_length=64,
        choices=Category.choices,
        default=Category.GENERAL,
    )
    title = models.CharField(max_length=255)
    content = models.TextField()

    class Meta:
        verbose_name = "FAQ элемент"
        verbose_name_plural = "FAQ элементы"
        ordering = ["id"]

    def __str__(self) -> str:
        return self.title


# ────────────────────────────────────────────
# Страница «О нас»
# ────────────────────────────────────────────


class AboutPage(models.Model):
    """Контент страницы «О нас» (синглтон)."""

    title = models.CharField("Заголовок", max_length=255, default="Чёрный Чиж")
    subtitle = models.TextField(
        "Подзаголовок",
        default="Профессиональный питомник с многолетним опытом разведения породистых собак",
    )
    mission_title = models.CharField(
        "Заголовок миссии", max_length=255, default="Наша миссия"
    )
    mission_text = models.TextField("Текст миссии", default="")
    cta_title = models.CharField(
        "Заголовок CTA", max_length=255, default="Присоединяйтесь к нам"
    )
    cta_text = models.TextField(
        "Текст CTA",
        default="Следите за новостями питомника и новыми помётами в наших социальных сетях",
    )

    class Meta:
        verbose_name = "Страница «О нас»"
        verbose_name_plural = "Страница «О нас»"

    def __str__(self) -> str:
        return "Страница «О нас»"

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj


class AboutValue(models.Model):
    """Принцип / ценность на странице «О нас»."""

    page = models.ForeignKey(
        AboutPage,
        on_delete=models.CASCADE,
        related_name="values",
        verbose_name="Страница",
    )
    title = models.CharField("Заголовок", max_length=255)
    description = models.TextField("Описание")
    order = models.PositiveIntegerField("Порядок", default=0)

    class Meta:
        verbose_name = "Принцип"
        verbose_name_plural = "Принципы"
        ordering = ["order"]

    def __str__(self) -> str:
        return self.title


class AboutMilestone(models.Model):
    """Веха / событие на таймлайне «О нас»."""

    page = models.ForeignKey(
        AboutPage,
        on_delete=models.CASCADE,
        related_name="milestones",
        verbose_name="Страница",
    )
    year = models.CharField("Год", max_length=10)
    text = models.CharField("Описание", max_length=255)
    order = models.PositiveIntegerField("Порядок", default=0)

    class Meta:
        verbose_name = "Веха"
        verbose_name_plural = "Вехи"
        ordering = ["order"]

    def __str__(self) -> str:
        return f"{self.year} — {self.text}"


# ────────────────────────────────────────────
# Страница «Контакты»
# ────────────────────────────────────────────


class ContactsPage(models.Model):
    """Контент страницы «Контакты» (синглтон)."""

    title = models.CharField("Заголовок", max_length=255, default="Контакты")
    subtitle = models.TextField(
        "Подзаголовок",
        default="Свяжитесь с нами удобным для вас способом — мы всегда на связи",
    )
    address = models.CharField("Адрес", max_length=255, default="Москва, Россия")
    address_note = models.CharField(
        "Примечание к адресу",
        max_length=255,
        default="Посещение питомника — по предварительной записи",
    )
    banner_title = models.CharField(
        "Заголовок баннера", max_length=255, default="Остались вопросы?"
    )
    banner_text = models.TextField(
        "Текст баннера",
        default="Напишите нам, и мы ответим в ближайшее время. Мы открыты для общения и всегда рады помочь с выбором питомца.",
    )
    banner_email = models.EmailField(
        "Email баннера", default="info@sharpei.club"
    )

    class Meta:
        verbose_name = "Страница «Контакты»"
        verbose_name_plural = "Страница «Контакты»"

    def __str__(self) -> str:
        return "Страница «Контакты»"

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj


class ContactInfo(models.Model):
    """Контактные данные (телефон, email)."""

    class ContactType(models.TextChoices):
        PHONE = "phone", "Телефон"
        EMAIL = "email", "Электронная почта"

    page = models.ForeignKey(
        ContactsPage,
        on_delete=models.CASCADE,
        related_name="contacts",
        verbose_name="Страница",
    )
    contact_type = models.CharField(
        "Тип", max_length=32, choices=ContactType.choices
    )
    label = models.CharField("Подпись", max_length=100)
    value = models.CharField("Значение", max_length=255)
    href = models.CharField("Ссылка", max_length=255)
    order = models.PositiveIntegerField("Порядок", default=0)

    class Meta:
        verbose_name = "Контакт"
        verbose_name_plural = "Контакты"
        ordering = ["order"]

    def __str__(self) -> str:
        return f"{self.label}: {self.value}"


class SocialLink(models.Model):
    """Ссылка на соцсеть."""

    page = models.ForeignKey(
        ContactsPage,
        on_delete=models.CASCADE,
        related_name="socials",
        verbose_name="Страница",
    )
    name = models.CharField(
        "Ключ иконки",
        max_length=50,
        help_text="vk, messenger, instagram, whatsapp",
    )
    label = models.CharField("Отображаемое название", max_length=100)
    value = models.CharField("Отображаемое значение", max_length=255)
    href = models.URLField("Ссылка", max_length=500)
    order = models.PositiveIntegerField("Порядок", default=0)

    class Meta:
        verbose_name = "Соцсеть"
        verbose_name_plural = "Соцсети"
        ordering = ["order"]

    def __str__(self) -> str:
        return self.label


class Schedule(models.Model):
    """Время работы."""

    page = models.ForeignKey(
        ContactsPage,
        on_delete=models.CASCADE,
        related_name="schedule",
        verbose_name="Страница",
    )
    days = models.CharField("Дни", max_length=100)
    hours = models.CharField("Часы", max_length=100)
    order = models.PositiveIntegerField("Порядок", default=0)

    class Meta:
        verbose_name = "Расписание"
        verbose_name_plural = "Расписание"
        ordering = ["order"]

    def __str__(self) -> str:
        return f"{self.days}: {self.hours}"
