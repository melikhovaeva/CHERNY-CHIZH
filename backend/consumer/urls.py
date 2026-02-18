from django.urls import path
from consumer.views import FAQItemViewSet


urlpatterns = [
    path(
        "faq/",
        FAQItemViewSet.as_view({"get": "list"}),
        name="faq-item-list",
    ),
]

