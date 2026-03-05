from rest_framework import viewsets
from rest_framework.permissions import AllowAny

from consumer.models import FAQItem
from consumer.schema import extend_schema_view, faq_item_view_schema
from consumer.serializers import FAQItemSerializer


@extend_schema_view(**faq_item_view_schema)
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

