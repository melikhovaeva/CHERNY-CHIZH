
from django.urls import include, path
from rest_framework import permissions
from rest_framework.routers import DefaultRouter

from common.views import (
    BreedViewSet,
    DictionaryViewSet,
    PuppyByBreedSlugViewSet,
    PuppyViewSet,
)
from consumer.views import FAQItemViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

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

router.APIRootView.permission_classes = [permissions.AllowAny]

urlpatterns = [
    path("users/", include("user_management.urls")),
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("", include(router.urls)),
]
