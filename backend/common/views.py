from rest_framework import viewsets
from common.models import Breed, Puppy
from common.serializers import BreedListSerializer, PuppyByBreedListSerializer, PuppyListSerializer


class PuppyViewSet(viewsets.ReadOnlyModelViewSet):
    """Эндпоинт для получения списка щенков."""

    queryset = Puppy.objects.select_related("breed").prefetch_related("photos").all()
    serializer_class = PuppyListSerializer

class PuppyByBreedSlugViewSet(viewsets.ReadOnlyModelViewSet):
    """Эндпоинт для получения списка щенков по породе."""

    serializer_class = PuppyByBreedListSerializer

    def get_queryset(self):
        breed_slug = self.kwargs.get("breed_slug")
        matching_breed = next(
            (breed for breed in Breed.objects.all() if breed.slug == breed_slug),
            None,
        )
        if not matching_breed:
            return Puppy.objects.none()

        return (
            Puppy.objects.filter(breed=matching_breed)
            .select_related("breed")
            .prefetch_related("photos")
        )

class BreedViewSet(viewsets.ReadOnlyModelViewSet):
    """Эндпоинт для получения списка всех пород."""

    queryset = Breed.objects.all()
    serializer_class = BreedListSerializer