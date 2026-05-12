from django.core.management.base import BaseCommand

from consumer.models import (
    AboutMilestone,
    AboutPage,
    AboutValue,
    ContactInfo,
    ContactsPage,
    Schedule,
    SocialLink,
)


ABOUT_PAGE = {
    "title": "Чёрный Чиж",
    "subtitle": "Профессиональный питомник с многолетним опытом разведения породистых собак",
    "mission_title": "Наша миссия",
    "mission_text": (
        "Мы убеждены, что каждая собака заслуживает любящий дом, а каждый "
        "владелец — здорового и воспитанного питомца. Наш питомник объединяет "
        "лучшие практики разведения, ветеринарии и кинологии, чтобы вы "
        "получили не просто щенка, а настоящего члена семьи."
    ),
    "cta_title": "Присоединяйтесь к нам",
    "cta_text": "Следите за новостями питомника и новыми помётами в наших социальных сетях",
}

ABOUT_VALUES = [
    {
        "title": "Здоровье",
        "description": (
            "Все наши собаки проходят полное генетическое тестирование "
            "и регулярные ветеринарные осмотры. Мы гарантируем здоровье каждого щенка."
        ),
        "order": 1,
    },
    {
        "title": "Родословная",
        "description": (
            "Мы работаем только с линиями, подтверждёнными документами РКФ и FCI. "
            "Каждый щенок получает полный пакет документов."
        ),
        "order": 2,
    },
    {
        "title": "Социализация",
        "description": (
            "Щенки растут в домашних условиях, привыкают к людям "
            "и другим животным с первых дней жизни."
        ),
        "order": 3,
    },
    {
        "title": "Поддержка",
        "description": (
            "Мы остаёмся на связи с владельцами наших щенков "
            "и всегда готовы помочь советом по содержанию и воспитанию."
        ),
        "order": 4,
    },
]

ABOUT_MILESTONES = [
    {"year": "2015", "text": "Основание питомника", "order": 1},
    {"year": "2017", "text": "Первые чемпионы на выставках РКФ", "order": 2},
    {"year": "2019", "text": "Расширение породного состава", "order": 3},
    {"year": "2021", "text": "Международные титулы FCI", "order": 4},
    {"year": "2023", "text": "Запуск образовательной платформы", "order": 5},
]

CONTACTS_PAGE = {
    "title": "Контакты",
    "subtitle": "Свяжитесь с нами удобным для вас способом — мы всегда на связи",
    "address": "Москва, Россия",
    "address_note": "Посещение питомника — по предварительной записи",
    "banner_title": "Остались вопросы?",
    "banner_text": (
        "Напишите нам, и мы ответим в ближайшее время. Мы открыты для "
        "общения и всегда рады помочь с выбором питомца."
    ),
    "banner_email": "info@sharpei.club",
}

CONTACTS = [
    {
        "contact_type": ContactInfo.ContactType.PHONE,
        "label": "Телефон",
        "value": "+7 (926) 232-43-07",
        "href": "tel:+79262324307",
        "order": 1,
    },
    {
        "contact_type": ContactInfo.ContactType.EMAIL,
        "label": "Электронная почта",
        "value": "info@sharpei.club",
        "href": "mailto:info@sharpei.club",
        "order": 2,
    },
]

SOCIALS = [
    {
        "name": "vk",
        "label": "ВКонтакте",
        "value": "https://vk.com/sharpei.club",
        "href": "https://vk.com/sharpei.club",
        "order": 1,
    },
    {
        "name": "messenger",
        "label": "Telegram",
        "value": "@sharpei.club",
        "href": "https://t.me/sharpei.club",
        "order": 2,
    },
    {
        "name": "instagram",
        "label": "Instagram",
        "value": "@sharpei.club",
        "href": "https://www.instagram.com/sharpei.club",
        "order": 3,
    },
    {
        "name": "whatsapp",
        "label": "WhatsApp",
        "value": "+7 (926) 232-43-07",
        "href": "https://wa.me/79262324307",
        "order": 4,
    },
]

SCHEDULE = [
    {"days": "Пн — Пт", "hours": "10:00 — 20:00", "order": 1},
    {"days": "Сб — Вс", "hours": "11:00 — 18:00", "order": 2},
]


class Command(BaseCommand):
    help = "Заполняет страницы «О нас» и «Контакты» начальными данными."

    def add_arguments(self, parser):
        parser.add_argument(
            "--clear",
            action="store_true",
            help="Удалить все существующие данные страниц перед заполнением.",
        )

    def handle(self, *args, **options):
        clear: bool = options["clear"]

        self._fill_about(clear)
        self._fill_contacts(clear)

        self.stdout.write(self.style.SUCCESS("Страницы «О нас» и «Контакты» заполнены."))

    def _fill_about(self, clear: bool):
        if clear:
            AboutPage.objects.all().delete()

        page, created = AboutPage.objects.update_or_create(
            pk=1, defaults=ABOUT_PAGE,
        )
        action = "Создана" if created else "Обновлена"
        self.stdout.write(self.style.SUCCESS(f"{action} страница «О нас»"))

        if created or clear:
            page.values.all().delete()
            for item in ABOUT_VALUES:
                AboutValue.objects.create(page=page, **item)
            self.stdout.write(
                self.style.SUCCESS(f"  Принципы: {len(ABOUT_VALUES)}")
            )

            page.milestones.all().delete()
            for item in ABOUT_MILESTONES:
                AboutMilestone.objects.create(page=page, **item)
            self.stdout.write(
                self.style.SUCCESS(f"  Вехи: {len(ABOUT_MILESTONES)}")
            )
        else:
            self.stdout.write(
                self.style.WARNING("  Принципы и вехи не перезаписаны (используйте --clear)")
            )

    def _fill_contacts(self, clear: bool):
        if clear:
            ContactsPage.objects.all().delete()

        page, created = ContactsPage.objects.update_or_create(
            pk=1, defaults=CONTACTS_PAGE,
        )
        action = "Создана" if created else "Обновлена"
        self.stdout.write(self.style.SUCCESS(f"{action} страница «Контакты»"))

        if created or clear:
            page.contacts.all().delete()
            for item in CONTACTS:
                ContactInfo.objects.create(page=page, **item)
            self.stdout.write(
                self.style.SUCCESS(f"  Контакты: {len(CONTACTS)}")
            )

            page.socials.all().delete()
            for item in SOCIALS:
                SocialLink.objects.create(page=page, **item)
            self.stdout.write(
                self.style.SUCCESS(f"  Соцсети: {len(SOCIALS)}")
            )

            page.schedule.all().delete()
            for item in SCHEDULE:
                Schedule.objects.create(page=page, **item)
            self.stdout.write(
                self.style.SUCCESS(f"  Расписание: {len(SCHEDULE)}")
            )
        else:
            self.stdout.write(
                self.style.WARNING("  Дочерние данные не перезаписаны (используйте --clear)")
            )
