from rest_framework import viewsets
from common.models import Breed, Puppy
from common.serializers import BreedListSerializer, PuppyByBreedListSerializer, PuppyListSerializer


class PuppyViewSet(viewsets.ReadOnlyModelViewSet):
    """Эндпоинт для получения списка щенков."""

    queryset = Puppy.objects.select_related("breed").prefetch_related("photos").all()
    serializer_class = PuppyListSerializer

class PuppyByBreedViewSet(viewsets.ReadOnlyModelViewSet):
    """Эндпоинт для получения списка щенков по породе."""

    serializer_class = PuppyByBreedListSerializer
    def get_queryset(self):
        breed_id = self.kwargs.get("breed_id")
        return Puppy.objects.filter(breed__id=breed_id).select_related("breed").prefetch_related("photos")

class BreedViewSet(viewsets.ReadOnlyModelViewSet):
    """Эндпоинт для получения списка всех пород."""

    queryset = Breed.objects.all()
    serializer_class = BreedListSerializer