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


def _find_group_by_identifier(identifier: str):
    """
    Находит группу словарей по числовому id или строковому ключу
    """
    try:
        group_id = int(identifier)
        group_conf = DICTIONARY_GROUPS.get(group_id)
        if group_conf:
            return group_id, group_conf
    except (TypeError, ValueError):
        pass
    for group_id, group_conf in DICTIONARY_GROUPS.items():
        if group_conf.get("key") == identifier:
            return group_id, group_conf

    return None, None


def _find_dictionary_in_group(group_conf, dict_identifier: str):
    """
    Находит словарь внутри группы
    """
    try:
        dict_pk = int(dict_identifier)
        for dict_key, dict_conf in group_conf["dictionaries"].items():
            if dict_conf["id"] == dict_pk:
                return dict_key, dict_conf
    except (TypeError, ValueError):
        pass

    if dict_identifier in group_conf["dictionaries"]:
        dict_key = dict_identifier
        return dict_key, group_conf["dictionaries"][dict_key]

    return None, None


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

    - GET /api/dictionaries/ - список групп словарей (минимизированный)
    - GET /api/dictionaries/{id}/ - конкретная группа по id со всеми словарями
    - GET /api/dictionaries/{name}/ - конкретная группа по имени со всеми словарями
    - GET /api/dictionaries/{id}/{dict_id}/ - конкретный словарь группы по id группы и id словаря.
    - GET /api/dictionaries/{name}/{dict_name}/ - конкретный словарь группы по имени группы и имени словаря.
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
        Возвращает подробную структуру одной группы словарей
        """
        group_id, group_conf = _find_group_by_identifier(pk)
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
        url_path=r"(?P<dict_identifier>[-\w]+)",
    )
    def dictionary(self, request: Request, pk=None, dict_identifier: str = None) -> Response:
        """
        Возвращает один конкретный словарь внутри группы
        """
        group_id, group_conf = _find_group_by_identifier(pk)
        if not group_conf:
            return Response(
                {"detail": "Dictionary group not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        dict_key, target_conf = _find_dictionary_in_group(group_conf, dict_identifier)
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
            "key": dict_key,
            "verbose_name": target_conf["verbose_name"],
            "items": serializer.data,
        }

        return Response(payload)