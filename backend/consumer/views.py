from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import (
    OpenApiExample,
    OpenApiParameter,
    extend_schema_view,
    extend_schema,
)

from consumer.models import FAQItem
from consumer.serializers import FAQItemSerializer


@extend_schema_view(
    list=extend_schema(
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
    retrieve=extend_schema(
        summary="Детали FAQ-элемента",
        description="Возвращает один элемент FAQ по идентификатору.",
        tags=["FAQ"],
    ),
)
class FAQItemViewSet(viewsets.ReadOnlyModelViewSet):
    """Эндпоинт для получения FAQ-элементов."""

    permission_classes = [AllowAny]
    serializer_class = FAQItemSerializer

    def get_queryset(self):
        queryset = FAQItem.objects.all()
        category = self.request.query_params.get("category")
        if category:
            queryset = queryset.filter(category=category)
        return queryset.order_by("id")

