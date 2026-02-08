from rest_framework import viewsets
from common.models import Puppy
from common.serializers import PuppyListSerializer


class PuppyViewSet(viewsets.ReadOnlyModelViewSet):
    """Эндпоинт для получения списка всех щенков."""

    queryset = Puppy.objects.select_related("breed").all()
    serializer_class = PuppyListSerializer
