"""
OpenAPI (drf-spectacular) схема для приложения common.
Описания эндпоинтов и типы для сериализаторов.
"""
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import (
    OpenApiExample,
    OpenApiParameter,
    extend_schema,
    extend_schema_view,
)

from drf_spectacular.utils import extend_schema_field

__all__ = [
    "OpenApiTypes",
    "extend_schema_field",
    "extend_schema",
    "extend_schema_view",
    "OpenApiParameter",
    "OpenApiExample",
    "dog_view_schema",
    "dog_by_breed_schema",
    "breed_view_schema",
    "dictionary_view_schema",
    "request_view_schema",
]

# --- DogViewSet ---
dog_view_schema = {
    "list": extend_schema(
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
                            {"id": 5, "name": "Ветпаспорт"},
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
    "retrieve": extend_schema(
        summary="Карточка собаки",
        description=(
            "Возвращает подробную информацию по одной собаке, включая породу, "
            "фотографии, документы и родителей."
        ),
        tags=["Dogs"],
        parameters=[
            OpenApiParameter(
                name="pk",
                type=OpenApiTypes.INT,
                location=OpenApiParameter.PATH,
                description="ID собаки.",
            ),
        ],
    ),
}

# --- DogByBreedSlugViewSet ---
dog_by_breed_schema = {
    "list": extend_schema(
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
    "retrieve": extend_schema(
        summary="Карточка собаки выбранной породы",
        description=(
            "Возвращает подробную информацию по одной собаке внутри выбранной породы. "
            "Используется путь `/breeds/{breed_slug}/dogs/{id}/`."
        ),
        tags=["Dogs"],
        parameters=[
            OpenApiParameter(
                name="pk",
                type=OpenApiTypes.INT,
                location=OpenApiParameter.PATH,
                description="ID собаки.",
            ),
        ],
    ),
}

# --- BreedViewSet ---
breed_view_schema = {
    "list": extend_schema(
        summary="Список пород",
        description="Возвращает список всех пород с краткой информацией и описанием.",
        tags=["Breeds"],
    ),
    "retrieve": extend_schema(
        summary="Информация о породе",
        description="Возвращает подробную информацию об одной породе, включая описательные блоки.",
        tags=["Breeds"],
    ),
}

# --- DictionaryViewSet ---
dictionary_view_schema = {
    "list": extend_schema(
        operation_id="dictionaries_list",
        summary="Список групп словарей",
        description=(
            "Возвращает список доступных групп словарей (справочников), "
            "используемых на фронтенде. Для детальной структуры используйте "
            "эндпоинт получения конкретной группы."
        ),
        tags=["Dictionaries"],
        responses={200: OpenApiTypes.OBJECT},
    ),
    "retrieve": extend_schema(
        operation_id="dictionaries_retrieve",
        summary="Детальная структура группы словарей",
        description=(
            "Возвращает структуру одной группы словарей, включая список словарей "
            "и их элементы (`code` / `label`)."
        ),
        tags=["Dictionaries"],
        responses={200: OpenApiTypes.OBJECT},
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
    "dictionary": extend_schema(
        operation_id="dictionaries_dictionary",
        summary="Конкретный словарь внутри группы",
        description=(
            "Возвращает один словарь внутри группы с его элементами (`code` / `label`). "
            "Идентификаторы группы и словаря могут быть как числовыми, так и строковыми ключами."
        ),
        tags=["Dictionaries"],
        responses={200: OpenApiTypes.OBJECT},
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
}

# --- RequestViewSet ---
request_view_schema = {
    "list": extend_schema(
        summary="Список заявок",
        description=(
            "Возвращает список заявок текущего пользователя. "
            "Администраторы видят все заявки."
        ),
        tags=["Requests"],
    ),
    "retrieve": extend_schema(
        summary="Детали заявки",
        description="Возвращает подробную информацию по одной заявке.",
        tags=["Requests"],
        parameters=[
            OpenApiParameter(
                name="pk",
                type=OpenApiTypes.INT,
                location=OpenApiParameter.PATH,
                description="ID заявки.",
            ),
        ],
    ),
    "create": extend_schema(
        summary="Создать заявку",
        description=(
            "Создаёт новую заявку на щенка или обращение. "
            "Для аутентифицированного пользователя персональные данные "
            "подставляются автоматически из профиля."
        ),
        tags=["Requests"],
    ),
}
