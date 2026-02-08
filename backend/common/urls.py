from django.urls import path, include
from rest_framework.routers import DefaultRouter

from common.views import BreedViewSet, PuppyViewSet

router = DefaultRouter()
router.register(r"puppies", PuppyViewSet, basename="puppy")
router.register(r"breeds", BreedViewSet, basename="breed")

urlpatterns = [
    path("", include(router.urls)),
]
