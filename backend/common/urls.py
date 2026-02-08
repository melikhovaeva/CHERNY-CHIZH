from django.urls import path, include
from rest_framework.routers import DefaultRouter

from common.views import PuppyViewSet

router = DefaultRouter()
router.register(r"puppies", PuppyViewSet, basename="puppy")

urlpatterns = [
    path("", include(router.urls)),
]
