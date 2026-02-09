from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.response import Response

from common.dictionaries import DICTIONARY_GROUPS
from common.models import Breed, Puppy
from common.serializers import (
    BreedListSerializer,
    PuppyByBreedListSerializer,
    PuppyListSerializer,
)


class PuppyViewSet(viewsets.ReadOnlyModelViewSet):
    """Эндпоинт для получения списка щенков"""

    queryset = Puppy.objects.select_related("breed").prefetch_related("photos").all()
    serializer_class = PuppyListSerializer

class PuppyByBreedSlugViewSet(viewsets.ReadOnlyModelViewSet):
    """Эндпоинт для получения списка щенков по породе"""

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
    """Эндпоинт для получения списка всех пород"""

    queryset = Breed.objects.all()
    serializer_class = BreedListSerializer


class DictionaryViewSet(viewsets.ViewSet):
    """
    Эндпоинт для получения групп словарей и их содержимого.

    - GET /api/dictionaries/              - список групп (минимизированный).
    - GET /api/dictionaries/{id}/         - конкретная группа со всеми словарями и их элементами.
    - GET /api/dictionaries/{id}/{dict}/  - конкретный словарь внутри группы.
    """

    def list(self, request: Request) -> Response:
        """
        Возвращает список групп словарей.
        """
        result = {}
        for group_id, group_conf in DICTIONARY_GROUPS.items():
            key = group_conf["key"]
            result[key] = {
                "id": group_id,
                "name": group_conf["name"],
            }

        return Response(result)

    def retrieve(self, request: Request, pk=None) -> Response:
        """
        Возвращает подробную структуру одной группы словарей по id
        """
        try:
            group_id = int(pk)
        except (TypeError, ValueError):
            return Response(
                {"detail": "Invalid dictionary group id."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        group_conf = DICTIONARY_GROUPS.get(group_id)
        if not group_conf:
            return Response(
                {"detail": "Dictionary group not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        dictionaries_payload = {}
        for dict_key, dict_conf in group_conf["dictionaries"].items():
            model = dict_conf["model"]
            serializer_class = dict_conf["serializer"]

            queryset = model.objects.all()
            serializer = serializer_class(queryset, many=True)

            dictionaries_payload[dict_key] = {
                "id": dict_conf["id"],
                "name": dict_conf["name"],
                "verbose_name": dict_conf["verbose_name"],
                "items": serializer.data,
            }

        payload = {
            "id": group_id,
            "name": group_conf["name"],
            "verbose_name": group_conf.get(
                "verbose_name", group_conf["name"]
            ),
            "dictionaries": dictionaries_payload,
        }

        return Response(payload)

    @action(
        detail=True,
        methods=["get"],
        url_path=r"(?P<dict_id>\d+)",
    )
    def dictionary(self, request: Request, pk=None, dict_id: str = None) -> Response:
        """
        Возвращает один конкретный словарь внутри группы по его числовому id
        """
        try:
            group_id = int(pk)
            dict_pk = int(dict_id)
        except (TypeError, ValueError):
            return Response(
                {"detail": "Invalid dictionary group or dictionary id."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        group_conf = DICTIONARY_GROUPS.get(group_id)
        if not group_conf:
            return Response(
                {"detail": "Dictionary group not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        target_conf = None
        target_key = None
        for dict_key, dict_conf in group_conf["dictionaries"].items():
            if dict_conf["id"] == dict_pk:
                target_conf = dict_conf
                target_key = dict_key
                break

        if not target_conf:
            return Response(
                {"detail": "Dictionary not found in group."},
                status=status.HTTP_404_NOT_FOUND,
            )

        model = target_conf["model"]
        serializer_class = target_conf["serializer"]

        queryset = model.objects.all()
        serializer = serializer_class(queryset, many=True)

        payload = {
            "id": target_conf["id"],
            "name": target_conf["name"],
            "key": target_key,
            "verbose_name": target_conf["verbose_name"],
            "items": serializer.data,
        }

        return Response(payload)