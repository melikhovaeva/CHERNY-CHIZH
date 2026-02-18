
from django.urls import include, path
from rest_framework.routers import DefaultRouter

from common.views import (
    BreedViewSet,
    DictionaryViewSet,
    PuppyByBreedSlugViewSet,
    PuppyViewSet,
)
from consumer.views import FAQItemViewSet


router = DefaultRouter()
router.register(r"puppies", PuppyViewSet, basename="puppy")
router.register(r"breeds", BreedViewSet, basename="breed")
router.register(
    r"breeds/(?P<breed_slug>[-\w]+)/puppies",
    PuppyByBreedSlugViewSet,
    basename="puppy-by-breed",
)
router.register(r"dictionaries", DictionaryViewSet, basename="dictionary")
router.register(r"faq", FAQItemViewSet, basename="faq-item")

urlpatterns = [
    path("", include(router.urls)),
]
