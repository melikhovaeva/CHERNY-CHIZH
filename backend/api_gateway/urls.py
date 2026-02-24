
from django.urls import include, path
from rest_framework import permissions
from rest_framework.routers import DefaultRouter

from common.views import (
    BreedViewSet,
    DictionaryViewSet,
    DogByBreedSlugViewSet,
    DogViewSet,
    RequestViewSet,
)
from consumer.views import FAQItemViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = DefaultRouter()
router.register(r"dogs", DogViewSet, basename="dog")
router.register(r"breeds", BreedViewSet, basename="breed")
router.register(
    r"breeds/(?P<breed_slug>[-\w]+)/dogs",
    DogByBreedSlugViewSet,
    basename="dog-by-breed",
)
router.register(r"dictionaries", DictionaryViewSet, basename="dictionary")
router.register(r"faq", FAQItemViewSet, basename="faq-item")
router.register(r"requests", RequestViewSet, basename="request")

router.APIRootView.permission_classes = [permissions.AllowAny]

urlpatterns = [
    path("users/", include("user_management.urls")),
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("", include(router.urls)),
]
