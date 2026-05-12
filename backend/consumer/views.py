from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from consumer.models import AboutPage, ContactsPage, FAQItem
from consumer.schema import (
    about_page_schema,
    contacts_page_schema,
    extend_schema_view,
    faq_item_view_schema,
)
from consumer.serializers import (
    AboutPageSerializer,
    ContactsPageSerializer,
    FAQItemSerializer,
)


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


class AboutPageView(APIView):
    """Контент страницы «О нас»."""

    permission_classes = [AllowAny]

    @about_page_schema
    def get(self, request):
        page = AboutPage.load()
        serializer = AboutPageSerializer(page)
        return Response(serializer.data)


class ContactsPageView(APIView):
    """Контент страницы «Контакты»."""

    permission_classes = [AllowAny]

    @contacts_page_schema
    def get(self, request):
        page = ContactsPage.load()
        serializer = ContactsPageSerializer(page)
        return Response(serializer.data)
