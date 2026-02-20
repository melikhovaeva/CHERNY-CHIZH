from django.urls import include, path
from rest_framework.routers import DefaultRouter

from common.views import (
    BreedViewSet,
    DictionaryViewSet,
    PuppyByBreedSlugViewSet,
    PuppyViewSet,
    RequestViewSet,
)