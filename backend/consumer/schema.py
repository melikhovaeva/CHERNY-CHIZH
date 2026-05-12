"""
OpenAPI (drf-spectacular) схема для приложения consumer.
Описания эндпоинтов FAQ и страниц «О нас» / «Контакты».
"""
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import (
    OpenApiExample,
    OpenApiParameter,
    extend_schema,
    extend_schema_view,
)

from consumer.serializers import (
    AboutPageSerializer,
    ContactsPageSerializer,
)

__all__ = [
    "extend_schema_view",
    "faq_item_view_schema",
    "about_page_schema",
    "contacts_page_schema",
]

# --- FAQItemViewSet ---
faq_item_view_schema = {
    "list": extend_schema(
        summary="Список FAQ-элементов",
        description=(
            "Возвращает список часто задаваемых вопросов. "
            "Можно отфильтровать по категории."
        ),
        tags=["FAQ"],
        parameters=[
            OpenApiParameter(
                name="category",
                type=OpenApiTypes.STR,
                location=OpenApiParameter.QUERY,
                required=False,
                description="Категория FAQ (если указана, вернутся только элементы этой категории).",
            ),
        ],
        examples=[
            OpenApiExample(
                "Пример списка FAQ",
                description="Пример ответа с несколькими вопросами и ответами.",
                value=[
                    {
                        "id": 1,
                        "title": "Как забронировать щенка?",
                        "content": "Оставьте заявку на сайте, и мы свяжемся с вами.",
                        "category": "requests",
                    },
                    {
                        "id": 2,
                        "title": "Как подготовиться к приезду щенка?",
                        "content": "Подготовьте место для сна, миски и игрушки.",
                        "category": "care",
                    },
                ],
            ),
        ],
    ),
    "retrieve": extend_schema(
        summary="Детали FAQ-элемента",
        description="Возвращает один элемент FAQ по идентификатору.",
        tags=["FAQ"],
    ),
}


# --- AboutPageView ---
about_page_schema = extend_schema(
    summary="Страница «О нас»",
    description="Возвращает контент страницы «О нас» с принципами и вехами.",
    tags=["Страницы"],
    responses=AboutPageSerializer,
)

# --- ContactsPageView ---
contacts_page_schema = extend_schema(
    summary="Страница «Контакты»",
    description="Возвращает контент страницы «Контакты» с контактами, соцсетями и расписанием.",
    tags=["Страницы"],
    responses=ContactsPageSerializer,
)
