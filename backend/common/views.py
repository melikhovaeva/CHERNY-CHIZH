from rest_framework import viewsets
from common.models import Breed, Puppy
from common.serializers import BreedListSerializer, PuppyListSerializer


class PuppyViewSet(viewsets.ReadOnlyModelViewSet):
    """Эндпоинт для получения списка всех щенков."""

    queryset = Puppy.objects.select_related("breed").prefetch_related("photos").all()
    serializer_class = PuppyListSerializer

class BreedViewSet(viewsets.ReadOnlyModelViewSet):
    """Эндпоинт для получения списка всех пород."""

    queryset = Breed.objects.all()
    serializer_class = BreedListSerializer