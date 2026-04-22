from django.core.files.storage import default_storage
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response

from common.dictionaries import DICTIONARY_GROUPS
from common.models import Breed, Dog, DogDocument, DogPhoto, Request as RequestModel
from common.pagination import DogPagination
from common.schema import (
    breed_view_schema,
    dictionary_view_schema,
    dog_by_breed_schema,
    dog_view_schema,
    extend_schema_view,
    request_view_schema,
)
from common.serializers import (
    AdminRequestUpdateSerializer,
    BreedListSerializer,
    DictionaryGroupListSerializer,
    DogAdminWriteSerializer,
    DogByBreedListSerializer,
    DogListSerializer,
    RequestSerializer,
    _keys_to_camel_case,
)
from user_management.permissions import IsAdmin


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


@extend_schema_view(**dog_view_schema)
class DogViewSet(viewsets.ReadOnlyModelViewSet):
    """Эндпоинт для получения списка собак (щенки и взрослые)."""

    permission_classes = [AllowAny]
    serializer_class = DogListSerializer
    pagination_class = DogPagination

    def get_queryset(self):
        queryset = (
            Dog.objects.filter(is_published=True)
            .select_related("breed")
            .prefetch_related("photos", "documents")
            .order_by("-id")
        )
        age_group = self.request.query_params.get("age_group")
        if age_group in {Dog.AGE_GROUP_PUPPY, Dog.AGE_GROUP_ADULT}:
            queryset = queryset.filter(age_group=age_group)
        return queryset


@extend_schema_view(**dog_by_breed_schema)
class DogByBreedSlugViewSet(viewsets.ReadOnlyModelViewSet):
    """Эндпоинт для получения списка собак по породе."""

    permission_classes = [AllowAny]
    serializer_class = DogByBreedListSerializer
    pagination_class = DogPagination

    def get_queryset(self):
        breed_slug = self.kwargs.get("breed_slug")
        matching_breed = next(
            (breed for breed in Breed.objects.all() if breed.slug == breed_slug),
            None,
        )
        if not matching_breed:
            return Dog.objects.none()

        queryset = (
            Dog.objects.filter(breed=matching_breed, is_published=True)
            .select_related("breed")
            .prefetch_related("photos", "documents")
            .order_by("-id")
        )

        age_group = self.request.query_params.get("age_group")
        if age_group in {Dog.AGE_GROUP_PUPPY, Dog.AGE_GROUP_ADULT}:
            queryset = queryset.filter(age_group=age_group)

        return queryset

@extend_schema_view(**breed_view_schema)
class BreedViewSet(viewsets.ReadOnlyModelViewSet):
    """Эндпоинт для получения списка всех пород"""

    permission_classes = [AllowAny]
    serializer_class = BreedListSerializer

    def get_queryset(self):
        return Breed.objects.select_related("article").all()


@extend_schema_view(**dictionary_view_schema)
class DictionaryViewSet(viewsets.ViewSet):
    """Эндпоинт для получения групп словарей и их содержимого.

    - GET /api/dictionaries/ - список групп словарей (минимизированный)
    - GET /api/dictionaries/{id}/ - конкретная группа по id со всеми словарями
    - GET /api/dictionaries/{name}/ - конкретная группа по имени со всеми словарями
    - GET /api/dictionaries/{id}/{dict_id}/ - конкретный словарь группы по id группы и id словаря.
    - GET /api/dictionaries/{name}/{dict_name}/ - конкретный словарь группы по имени группы и имени словаря.
    """

    permission_classes = [AllowAny]
    serializer_class = DictionaryGroupListSerializer

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
    
    
@extend_schema_view(**request_view_schema)
class RequestViewSet(viewsets.ModelViewSet):
    serializer_class = RequestSerializer
    http_method_names = ["get", "post", "patch", "put", "delete", "head", "options"]

    def get_permissions(self):
        if self.action == "create":
            return [AllowAny()]
        if self.action in ("update", "partial_update", "destroy"):
            return [IsAdmin()]
        return [IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            qs = RequestModel.objects.select_related("dog", "breed", "user").all()
        else:
            qs = RequestModel.objects.select_related("dog", "breed").filter(user=user)

        status_filter = self.request.query_params.get("status")
        if status_filter:
            qs = qs.filter(status=status_filter)

        type_filter = self.request.query_params.get("request_type")
        if type_filter:
            qs = qs.filter(request_type=type_filter)

        return qs

    def get_serializer_class(self):
        if self.action in ("update", "partial_update"):
            return AdminRequestUpdateSerializer
        return RequestSerializer

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

    def update(self, request: Request, *args, **kwargs) -> Response:
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        instance = serializer.save()
        out_serializer = RequestSerializer(instance, context={"request": request})
        return Response(_keys_to_camel_case(out_serializer.data))


class AdminDogViewSet(viewsets.ModelViewSet):
    """Админский CRUD для собак питомника."""

    permission_classes = [IsAdmin]
    pagination_class = DogPagination

    def get_queryset(self):
        queryset = (
            Dog.objects.select_related("breed")
            .prefetch_related("photos", "documents", "parent_links__parent")
            .order_by("-id")
        )
        age_group = self.request.query_params.get("age_group")
        if age_group in {Dog.AGE_GROUP_PUPPY, Dog.AGE_GROUP_ADULT}:
            queryset = queryset.filter(age_group=age_group)
        breed_id = self.request.query_params.get("breed")
        if breed_id:
            queryset = queryset.filter(breed_id=breed_id)
        search = self.request.query_params.get("search")
        if search:
            queryset = queryset.filter(name__icontains=search)
        return queryset

    def get_serializer_class(self):
        if self.action in ("create", "update", "partial_update"):
            return DogAdminWriteSerializer
        return DogListSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        instance = serializer.save()
        out = DogListSerializer(instance, context=self.get_serializer_context())
        return Response(out.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        instance = serializer.save()
        out = DogListSerializer(instance, context=self.get_serializer_context())
        return Response(out.data)

    @action(detail=True, methods=["post"], url_path="publish")
    def publish(self, request, pk=None):
        dog = self.get_object()
        dog.is_published = True
        dog.save(update_fields=["is_published"])
        out = DogListSerializer(dog, context=self.get_serializer_context())
        return Response(out.data)

    @action(detail=True, methods=["post"], url_path="unpublish")
    def unpublish(self, request, pk=None):
        dog = self.get_object()
        dog.is_published = False
        dog.save(update_fields=["is_published"])
        out = DogListSerializer(dog, context=self.get_serializer_context())
        return Response(out.data)

    @action(detail=True, methods=["post"], url_path="upload-photo", parser_classes=[MultiPartParser])
    def upload_photo(self, request, pk=None):
        dog = self.get_object()
        photo_file = request.FILES.get("photo")
        if not photo_file:
            return Response({"detail": "Файл не передан."}, status=status.HTTP_400_BAD_REQUEST)
        is_main = request.data.get("is_main", "false").lower() == "true"
        if is_main:
            dog.photos.update(is_main=False)
        photo = DogPhoto.objects.create(dog=dog, photo=photo_file, is_main=is_main)
        return Response(
            {"id": photo.id, "url": photo.photo.url, "isMain": photo.is_main},
            status=status.HTTP_201_CREATED,
        )

    @action(detail=True, methods=["delete"], url_path=r"photos/(?P<photo_id>\d+)")
    def delete_photo(self, request, pk=None, photo_id=None):
        dog = self.get_object()
        try:
            photo = dog.photos.get(id=photo_id)
        except DogPhoto.DoesNotExist:
            return Response({"detail": "Фото не найдено."}, status=status.HTTP_404_NOT_FOUND)
        photo.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=["post"], url_path=r"photos/(?P<photo_id>\d+)/set-main")
    def set_main_photo(self, request, pk=None, photo_id=None):
        dog = self.get_object()
        try:
            photo = dog.photos.get(id=photo_id)
        except DogPhoto.DoesNotExist:
            return Response({"detail": "Фото не найдено."}, status=status.HTTP_404_NOT_FOUND)
        dog.photos.update(is_main=False)
        photo.is_main = True
        photo.save(update_fields=["is_main"])
        return Response({"id": photo.id, "url": photo.photo.url, "isMain": True})

    @action(detail=True, methods=["post"], url_path="upload-document", parser_classes=[MultiPartParser])
    def upload_document(self, request, pk=None):
        dog = self.get_object()
        doc_file = request.FILES.get("file")
        if not doc_file:
            return Response({"detail": "Файл не передан."}, status=status.HTTP_400_BAD_REQUEST)
        doc_type = request.data.get("document_type", DogDocument.DOC_TYPE_PUPPY_CARD)
        if doc_type not in dict(DogDocument.DOC_TYPE_CHOICES):
            return Response({"detail": "Недопустимый тип документа."}, status=status.HTTP_400_BAD_REQUEST)
        doc = DogDocument.objects.create(
            dog=dog,
            file=doc_file,
            name=doc_file.name,
            document_type=doc_type,
        )
        return Response(
            {"id": doc.id, "name": doc.name, "documentType": doc.document_type, "url": doc.file.url},
            status=status.HTTP_201_CREATED,
        )

    @action(detail=True, methods=["delete"], url_path=r"documents/(?P<doc_id>\d+)")
    def delete_document(self, request, pk=None, doc_id=None):
        dog = self.get_object()
        try:
            doc = dog.documents.get(id=doc_id)
        except DogDocument.DoesNotExist:
            return Response({"detail": "Документ не найден."}, status=status.HTTP_404_NOT_FOUND)
        doc.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)