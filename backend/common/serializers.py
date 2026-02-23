from rest_framework import serializers

from common.models import (
    AnimalPotential,
    AnimalSex,
    AnimalStatus,
    Breed,
    BreedDescription,
    Puppy,
    PuppyDocument,
    PuppyParents,
    PuppyPhoto,
    Request,
)


def _to_camel_case(snake_str: str) -> str:
    """Преобразует snake_case в camelCase"""
    parts = snake_str.split("_")
    return parts[0].lower() + "".join(p.capitalize() for p in parts[1:])


def _keys_to_camel_case(data):
    """Рекурсивно преобразует все ключи словарей в camelCase"""
    if isinstance(data, dict):
        return {_to_camel_case(k): _keys_to_camel_case(v) for k, v in data.items()}
    if isinstance(data, list):
        return [_keys_to_camel_case(item) for item in data]
    return data


class CamelCaseSerializerMixin:
    """Миксин: результат to_representation отдаётся с ключами в camelCase"""

    def to_representation(self, instance):
        data = super().to_representation(instance)
        return _keys_to_camel_case(data)


class CodeLabelSerializer(CamelCaseSerializerMixin, serializers.Serializer):
    """Универсальный сериализатор для любого справочника code+label."""

    code = serializers.CharField()
    label = serializers.CharField()


AnimalStatusSerializer = CodeLabelSerializer
AnimalSexSerializer = CodeLabelSerializer
AnimalPotentialSerializer = CodeLabelSerializer


class BreedBriefSerializer(CamelCaseSerializerMixin, serializers.ModelSerializer):
    """Краткое представление породы для списка щенков"""

    photo = serializers.SerializerMethodField()

    class Meta:
        model = Breed
        fields = ("slug", "name", "full_name", "photo")

    def get_photo(self, obj):
        return obj.photo.url if obj.photo else None


class PuppyPhotosSerializer(CamelCaseSerializerMixin, serializers.ModelSerializer):
    url = serializers.CharField(source="photo.url")

    class Meta:
        model = PuppyPhoto
        fields = ("id", "url")


class PuppyDocumentsSerializer(CamelCaseSerializerMixin, serializers.ModelSerializer):
    url = serializers.SerializerMethodField()

    class Meta:
        model = PuppyDocument
        fields = ("id", "name", "url")

    def get_url(self, obj):
        return obj.file.url if obj.file else None


class PuppyBriefSerializer(CamelCaseSerializerMixin, serializers.ModelSerializer):
    class Meta:
        model = Puppy
        fields = ("id", "name")


class PuppyListSerializer(CamelCaseSerializerMixin, serializers.ModelSerializer):
    """Сериализатор для списка щенков"""

    breed = BreedBriefSerializer(read_only=True)
    status = CodeLabelSerializer(read_only=True)
    sex = CodeLabelSerializer(read_only=True)
    potential = CodeLabelSerializer(read_only=True)
    photos = PuppyPhotosSerializer(many=True, read_only=True)
    documents = PuppyDocumentsSerializer(many=True, read_only=True)
    parents = serializers.SerializerMethodField()

    class Meta:
        model = Puppy
        fields = (
            "id",
            "name",
            "international_name",
            "birth_date", "color",
            "description",
            "breed",
            "status",
            "sex",
            "potential",
            "photos",
            "documents",
            "parents",
        )

    def get_parents(self, obj: Puppy):
        """
        Возвращает словарь с информацией о родителях щенка:
        {
          "mother": {"id": <dog_id>, "name": <dog_name>},
          "father": {"id": <dog_id>, "name": <dog_name>},
        }
        """
        links = PuppyParents.objects.filter(puppy=obj)
        if not links:
            return None

        result = {}
        for link in links:
            parent_data = {
                "id": str(link.dog_id),
                "name": link.dog.name,
            }
            if link.role == PuppyParents.ROLE_MOTHER:
                result["mother"] = parent_data
            elif link.role == PuppyParents.ROLE_FATHER:
                result["father"] = parent_data

        return result or None


class PuppyByBreedListSerializer(CamelCaseSerializerMixin, serializers.ModelSerializer):
    """Сериализатор для списка щенков по породе."""

    breed = BreedBriefSerializer(read_only=True)
    status = CodeLabelSerializer(read_only=True)
    sex = CodeLabelSerializer(read_only=True)
    potential = CodeLabelSerializer(read_only=True)
    photos = PuppyPhotosSerializer(many=True, read_only=True)
    documents = PuppyDocumentsSerializer(many=True, read_only=True)

    class Meta:
        model = Puppy
        fields = (
            "__all__"
        )


class BreedDescriptionSerializer(CamelCaseSerializerMixin, serializers.ModelSerializer):
    """Описание породы с полями, сгруппированными как на фронте (блоки rating + text)."""

    class Meta:
        model = BreedDescription
        fields = ("appearance", "character", "adaptability", "care", "activity")

    def to_representation(self, instance):
        data = {
            "appearance": instance.appearance,
            "character": {"rating": instance.character_rating, "text": instance.character_text},
            "adaptability": {"rating": instance.adaptability_rating, "text": instance.adaptability_text},
            "care": {"rating": instance.care_rating, "text": instance.care_text},
            "activity": {"rating": instance.activity_rating, "text": instance.activity_text},
        }
        return _keys_to_camel_case(data)


class BreedListSerializer(CamelCaseSerializerMixin, serializers.ModelSerializer):
    """Сериализатор для списка пород."""

    description = BreedDescriptionSerializer(read_only=True)
    photo = serializers.SerializerMethodField()

    class Meta:
        model = Breed
        fields = ("id", "slug", "name", "full_name", "photo", "description")

    def get_photo(self, obj):
        return obj.photo.url if obj.photo else None


class RequestSerializer(CamelCaseSerializerMixin, serializers.ModelSerializer):
    PERSONAL_FIELDS = ("first_name", "last_name", "email", "phone", "messenger")

    class Meta:
        model = Request
        fields = (
            "id",
            "user",
            "first_name",
            "last_name",
            "email",
            "phone",
            "messenger",
            "message",
            "puppy",
        )
        read_only_fields = ("id", "user")

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        request = self.context.get("request")
        if request and hasattr(request, "user") and request.user.is_authenticated:
            for field_name in self.PERSONAL_FIELDS:
                self.fields[field_name].required = False
                self.fields[field_name].allow_blank = True

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if instance.puppy_id is not None:
            data["puppy"] = instance.puppy.name
        else:
            data["puppy"] = None
        if instance.user_id is not None:
            data["user"] = instance.user.email
        else:
            data["user"] = None
        return data
