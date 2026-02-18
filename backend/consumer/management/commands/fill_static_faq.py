from django.core.management.base import BaseCommand

from consumer.models import FAQItem


FAQ_ITEMS = [
    {
        "category": FAQItem.Category.GENERAL,
        "title": "Как я могу приобрести собаку из вашего питомника?",
        "content": (
            "Для приобретения собаки из нашего питомника свяжитесь с нами по указанным контактным данным или заполните форму на нашем сайте. Мы с удовольствием ответим на все ваши вопросы и организуем встречу с желаемым питомцем."
        ),
    },
    {
        "category": FAQItem.Category.GENERAL,
        "title": "Есть ли у собак родословная?",
        "content": (
            "Да, у всех собак в нашем питомнике есть родословная. Она составляется на основе данных о предках собаки и подтверждается документально."
        ),
    },
    {
        "category": FAQItem.Category.GENERAL,
        "title": "Осуществляете ли вы доставку за пределы вашей страны?",
        "content": (
            "Да, мы осуществляем доставку за пределы нашей страны. Стоимость доставки зависит от расстояния и веса собаки. Мы свяжемся с вами для уточнения деталей и обсуждения условий доставки."
        ),
    },
    {
        "category": FAQItem.Category.GENERAL,
        "title": "Есть ли у вас гарантия на купленную собаку?",
        "content": (
            "Да, мы даем гарантию на купленную собаку на 1 год. В течение этого времени мы будем помогать вам с уходом за собакой и решать любые вопросы, связанные с ее здоровьем и поведением."
        ),
    },
    {
        "category": FAQItem.Category.GENERAL,
        "title": "Что включено в стоимость покупки собаки?",
        "content": (
            "Для покупки собаки в нашем питомнике вы получаете: собаку, ветеринарный паспорт, прививки, кормление, уход и консультации по уходу за собакой."
        ),
    },
    {
        "category": FAQItem.Category.DELIVERY,
        "title": "Доставка по Москве",
        "content": (
            "Наш питомник располагается в ближнем Подмосковье и мы понимаем, что не у всех есть возможность и время приехать к нам. Мы готовы привезти Вам выбранного на сайте щенка к вам домой, при условии предварительного внесения небольшого депозита"
        ),
    },
    {
        "category": FAQItem.Category.DELIVERY,
        "title": "Доставка по России",
        "content": (
            "Мы осуществляем доставку по всей России. Стоимость доставки зависит от расстояния и веса собаки. Мы свяжемся с вами для уточнения деталей и обсуждения условий доставки."
        ),
    },
    {
        "category": FAQItem.Category.DELIVERY,
        "title": "Доставка за границу",
        "content": (
            "Доставка за границу осуществляется по предварительной договоренности. Мы свяжемся с вами для уточнения деталей и обсуждения условий доставки."
        ),
    },
]


class Command(BaseCommand):
    help = "Заполняет FAQ статическими данными для категорий general и delivery."

    def add_arguments(self, parser):
        parser.add_argument(
            "--clear",
            action="store_true",
            help="Удалить все существующие FAQ перед заполнением.",
        )

    def handle(self, *args, **options):
        clear: bool = options["clear"]

        if clear:
            deleted, _ = FAQItem.objects.all().delete()
            self.stdout.write(
                self.style.WARNING(f"Удалено существующих FAQ-элементов: {deleted}")
            )

        created = 0
        updated = 0
        skipped = 0

        for item in FAQ_ITEMS:
            obj, is_created = FAQItem.objects.update_or_create(
                category=item["category"],
                title=item["title"],
                defaults={"content": item["content"]},
            )
            if is_created:
                created += 1
                self.stdout.write(
                    self.style.SUCCESS(f"Создан FAQ: [{obj.category}] {obj.title}")
                )
            else:
                if obj.content == item["content"]:
                    skipped += 1
                else:
                    updated += 1
                    self.stdout.write(
                        self.style.SUCCESS(
                            f"Обновлён FAQ: [{obj.category}] {obj.title}"
                        )
                    )

        self.stdout.write(
            self.style.SUCCESS(
                f"Готово. Создано: {created}, обновлено: {updated}, пропущено: {skipped}."
            )
        )

