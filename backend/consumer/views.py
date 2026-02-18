from rest_framework import viewsets

from consumer.models import FAQItem
from consumer.serializers import FAQItemSerializer


class FAQItemViewSet(viewsets.ReadOnlyModelViewSet):
    """Эндпоинт для получения FAQ-элементов."""

    serializer_class = FAQItemSerializer

    def get_queryset(self):
        queryset = FAQItem.objects.all()
        category = self.request.query_params.get("category")
        if category:
            queryset = queryset.filter(category=category)
        return queryset.order_by("id")

