from django.urls import path, include
from rest_framework.routers import DefaultRouter

from common.views import BreedViewSet, PuppyByBreedSlugViewSet, PuppyViewSet

router = DefaultRouter()
router.register(r"puppies", PuppyViewSet, basename="puppy")
router.register(r"breeds", BreedViewSet, basename="breed")
router.register(r"breeds/(?P<breed_slug>[-\w]+)/puppies", PuppyByBreedSlugViewSet, basename="puppy-by-breed")

urlpatterns = [
    path("", include(router.urls)),
]
