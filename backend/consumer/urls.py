from django.urls import path
from consumer.views import AboutPageView, ContactsPageView, FAQItemViewSet


urlpatterns = [
    path(
        "faq/",
        FAQItemViewSet.as_view({"get": "list"}),
        name="faq-item-list",
    ),
    path(
        "pages/about/",
        AboutPageView.as_view(),
        name="about-page",
    ),
    path(
        "pages/contacts/",
        ContactsPageView.as_view(),
        name="contacts-page",
    ),
]
