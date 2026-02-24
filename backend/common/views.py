from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import (
    OpenApiExample,
    OpenApiParameter,
    extend_schema,
    extend_schema_view,
)

from common.dictionaries import DICTIONARY_GROUPS
from common.models import Breed, Dog, Request as RequestModel
from common.serializers import (
    BreedListSerializer,
    DogByBreedListSerializer,
    DogListSerializer,
    RequestSerializer,
    _keys_to_camel_case,
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


@extend_schema_view(
    list=extend_schema(
        summary="Список собак",
        description=(
            "Возвращает список собак (щенки и взрослые) с основными данными, "
            "фотографиями, документами и информацией о родителях. "
            "Можно отфильтровать по возрастной группе."
        ),
        tags=["Dogs"],
        parameters=[
            OpenApiParameter(
                name="age_group",
                type=OpenApiTypes.STR,
                location=OpenApiParameter.QUERY,
                required=False,
                description=(
                    "Возрастная группа собаки. Допустимые значения: "
                    "`${Dog.AGE_GROUP_PUPPY}` (щенки) или `${Dog.AGE_GROUP_ADULT}` (взрослые)."
                ),
            ),
        ],
        examples=[
            OpenApiExample(
                "Пример списка собак",
                description="Пример ответа при запросе списка доступных щенков.",
                value=[
                    {
                        "id": 1,
                        "name": "Чижик",
                        "internationalName": "Chizhik",
                        "birthDate": "2024-01-01",
                        "color": "черный",
                        "description": "Дружелюбный активный щенок.",
                        "breed": {
                            "slug": "labrador",
                            "name": "Лабрадор",
                            "fullName": "Лабрадор ретривер",
                            "photo": "/media/breeds/labrador.jpg",
                        },
                        "status": {"code": "available", "label": "Доступен"},
                        "sex": {"code": "male", "label": "Кобель"},
                        "potential": {"code": "pet", "label": "Компаньон"},
                        "photos": [
                            {"id": 10, "url": "/media/dogs/1/photo1.jpg"},
                        ],
                        "documents": [
                            {"id": 5, "name": "Ветпаспорт", "url": "/media/docs/passport.pdf"},
                        ],
                        "parents": {
                            "mother": {"id": "2", "name": "Луна"},
                            "father": {"id": "3", "name": "Марс"},
                        },
                    }
                ],
            ),
        ],
    ),
    retrieve=extend_schema(
        summary="Карточка собаки",
        description=(
            "Возвращает подробную информацию по одной собаке, включая породу, "
            "фотографии, документы и родителей."
        ),
        tags=["Dogs"],
    ),
)
class DogViewSet(viewsets.ReadOnlyModelViewSet):
    """Эндпоинт для получения списка собак (щенки и взрослые)."""

    serializer_class = DogListSerializer

    def get_queryset(self):
        queryset = (
            Dog.objects.select_related("breed")
            .prefetch_related("photos", "documents")
            .all()
        )
        age_group = self.request.query_params.get("age_group")
        if age_group in {Dog.AGE_GROUP_PUPPY, Dog.AGE_GROUP_ADULT}:
            queryset = queryset.filter(age_group=age_group)
        return queryset


@extend_schema_view(
    list=extend_schema(
        summary="Список собак по породе",
        description=(
            "Возвращает список собак выбранной породы по её slug. "
            "Поддерживает фильтрацию по возрастной группе."
        ),
        tags=["Dogs"],
        parameters=[
            OpenApiParameter(
                name="breed_slug",
                type=OpenApiTypes.STR,
                location=OpenApiParameter.PATH,
                description="Slug породы (например, `shpits`).",
            ),
            OpenApiParameter(
                name="age_group",
                type=OpenApiTypes.STR,
                location=OpenApiParameter.QUERY,
                required=False,
                description=(
                    "Возрастная группа собаки. Допустимые значения: "
                    "`${Dog.AGE_GROUP_PUPPY}` (щенки) или `${Dog.AGE_GROUP_ADULT}` (взрослые)."
                ),
            ),
        ],
    ),
    retrieve=extend_schema(
        summary="Карточка собаки выбранной породы",
        description=(
            "Возвращает подробную информацию по одной собаке внутри выбранной породы. "
            "Используется путь `/breeds/{breed_slug}/dogs/{id}/`."
        ),
        tags=["Dogs"],
    ),
)
class DogByBreedSlugViewSet(viewsets.ReadOnlyModelViewSet):
    """Эндпоинт для получения списка собак по породе."""

    serializer_class = DogByBreedListSerializer

    def get_queryset(self):
        breed_slug = self.kwargs.get("breed_slug")
        matching_breed = next(
            (breed for breed in Breed.objects.all() if breed.slug == breed_slug),
            None,
        )
        if not matching_breed:
            return Dog.objects.none()

        queryset = (
            Dog.objects.filter(breed=matching_breed)
            .select_related("breed")
            .prefetch_related("photos", "documents")
        )

        age_group = self.request.query_params.get("age_group")
        if age_group in {Dog.AGE_GROUP_PUPPY, Dog.AGE_GROUP_ADULT}:
            queryset = queryset.filter(age_group=age_group)

        return queryset

@extend_schema_view(
    list=extend_schema(
        summary="Список пород",
        description="Возвращает список всех пород с краткой информацией и описанием.",
        tags=["Breeds"],
    ),
    retrieve=extend_schema(
        summary="Информация о породе",
        description="Возвращает подробную информацию об одной породе, включая описательные блоки.",
        tags=["Breeds"],
    ),
)
class BreedViewSet(viewsets.ReadOnlyModelViewSet):
    """Эндпоинт для получения списка всех пород"""

    queryset = Breed.objects.all()
    serializer_class = BreedListSerializer


@extend_schema_view(
    list=extend_schema(
        summary="Список групп словарей",
        description=(
            "Возвращает список доступных групп словарей (справочников), "
            "используемых на фронтенде. Для детальной структуры используйте "
            "эндпоинт получения конкретной группы."
        ),
        tags=["Dictionaries"],
    ),
    retrieve=extend_schema(
        summary="Детальная структура группы словарей",
        description=(
            "Возвращает структуру одной группы словарей, включая список словарей "
            "и их элементы (`code` / `label`)."
        ),
        tags=["Dictionaries"],
        parameters=[
            OpenApiParameter(
                name="pk",
                type=OpenApiTypes.STR,
                location=OpenApiParameter.PATH,
                description=(
                    "Идентификатор группы: числовой ID или строковый ключ группы "
                    "(например, `dogs_filters`)."
                ),
            ),
        ],
        examples=[
            OpenApiExample(
                "Пример группы словарей",
                description="Пример структуры группы словарей с несколькими словарями и их элементами.",
                value={
                    "id": 1,
                    "name": "Фильтры по собакам",
                    "verboseName": "Фильтры по собакам",
                    "dictionaries": {
                        "status": {
                            "id": 10,
                            "name": "Статус собаки",
                            "verboseName": "Статус собаки",
                            "items": [
                                {"code": "available", "label": "Доступен"},
                                {"code": "reserved", "label": "Забронирован"},
                            ],
                        },
                        "sex": {
                            "id": 11,
                            "name": "Пол",
                            "verboseName": "Пол",
                            "items": [
                                {"code": "male", "label": "Кобель"},
                                {"code": "female", "label": "Сука"},
                            ],
                        },
                    },
                },
            ),
        ],
    ),
    dictionary=extend_schema(
        summary="Конкретный словарь внутри группы",
        description=(
            "Возвращает один словарь внутри группы с его элементами (`code` / `label`). "
            "Идентификаторы группы и словаря могут быть как числовыми, так и строковыми ключами."
        ),
        tags=["Dictionaries"],
        parameters=[
            OpenApiParameter(
                name="pk",
                type=OpenApiTypes.STR,
                location=OpenApiParameter.PATH,
                description="Идентификатор группы словарей (ID или ключ).",
            ),
            OpenApiParameter(
                name="dict_identifier",
                type=OpenApiTypes.STR,
                location=OpenApiParameter.PATH,
                description="Идентификатор конкретного словаря внутри группы (ID или ключ).",
            ),
        ],
        examples=[
            OpenApiExample(
                "Пример конкретного словаря",
                description="Пример структуры одного словаря группы с элементами code/label.",
                value={
                    "id": 10,
                    "name": "Статус собаки",
                    "key": "status",
                    "verboseName": "Статус собаки",
                    "items": [
                        {"code": "available", "label": "Доступен"},
                        {"code": "reserved", "label": "Забронирован"},
                    ],
                },
            ),
        ],
    ),
)
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

        return Response(_keys_to_camel_case(result))

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
            choices = dict_conf["choices"]
            items = [
                {"code": code, "label": label}
                for code, label in choices
            ]

            dictionaries_payload[dict_key] = {
                "id": dict_conf["id"],
                "name": dict_conf["name"],
                "verbose_name": dict_conf["verbose_name"],
                "items": items,
            }

        payload = {
            "id": group_id,
            "name": group_conf["name"],
            "verbose_name": group_conf.get(
                "verbose_name", group_conf["name"]
            ),
            "dictionaries": dictionaries_payload,
        }

        return Response(_keys_to_camel_case(payload))

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

        dict_key, target_conf = _find_dictionary_in_group(
            group_conf, dict_identifier
        )
        if not target_conf:
            return Response(
                {"detail": "Dictionary not found in group."},
                status=status.HTTP_404_NOT_FOUND,
            )

        choices = target_conf["choices"]
        items = [
            {"code": code, "label": label}
            for code, label in choices
        ]

        payload = {
            "id": target_conf["id"],
            "name": target_conf["name"],
            "key": dict_key,
            "verbose_name": target_conf["verbose_name"],
            "items": items,
        }

        return Response(_keys_to_camel_case(payload))
    
    
@extend_schema_view(
    list=extend_schema(
        summary="Список заявок",
        description=(
            "Возвращает список заявок текущего пользователя. "
            "Администраторы видят все заявки."
        ),
        tags=["Requests"],
    ),
    retrieve=extend_schema(
        summary="Детали заявки",
        description="Возвращает подробную информацию по одной заявке.",
        tags=["Requests"],
    ),
    create=extend_schema(
        summary="Создать заявку",
        description=(
            "Создаёт новую заявку на щенка или обращение. "
            "Для аутентифицированного пользователя персональные данные "
            "подставляются автоматически из профиля."
        ),
        tags=["Requests"],
    ),
)
class RequestViewSet(viewsets.ModelViewSet):
    serializer_class = RequestSerializer
    http_method_names = ["get", "post", "head", "options"]

    def get_permissions(self):
        if self.action == "create":
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return RequestModel.objects.all()
        return RequestModel.objects.filter(user=user)

    def create(self, request: Request) -> Response:
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data
        if request.user.is_authenticated:
            data["user"] = request.user
            data.setdefault("first_name", request.user.first_name)
            data.setdefault("last_name", request.user.last_name)
            data.setdefault("email", request.user.email)
            data.setdefault("phone", request.user.phone or "")
            data.setdefault("messenger", request.user.messenger or "")

        instance = RequestModel.objects.create_request(**data)
        out_serializer = RequestSerializer(instance, context={"request": request})
        return Response(
            _keys_to_camel_case(out_serializer.data),
            status=status.HTTP_201_CREATED,
        )