from django.urls import path, include
from rest_framework.routers import DefaultRouter

from common.views import BreedViewSet, PuppyByBreedViewSet, PuppyViewSet

router = DefaultRouter()
router.register(r"puppies", PuppyViewSet, basename="puppy")
router.register(r"breeds", BreedViewSet, basename="breed")
router.register(r"breeds/(?P<breed_id>\d+)/puppies", PuppyByBreedViewSet, basename="puppy-by-breed")

urlpatterns = [
    path("", include(router.urls)),
]
