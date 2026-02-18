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
