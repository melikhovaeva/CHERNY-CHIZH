from rest_framework import serializers

from common.models import (
    DogStatus,
    DogSex,
    DogPotential,
    Breed,
    BreedDescription,
    Dog,
    DogDocument,
    DogParent,
    DogPhoto,
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


class DogPhotosSerializer(CamelCaseSerializerMixin, serializers.ModelSerializer):
    url = serializers.CharField(source="photo.url")

    class Meta:
        model = DogPhoto
        fields = ("id", "url")


class DogDocumentsSerializer(CamelCaseSerializerMixin, serializers.ModelSerializer):
    url = serializers.SerializerMethodField()

    class Meta:
        model = DogDocument
        fields = ("id", "name", "url")

    def get_url(self, obj):
        return obj.file.url if obj.file else None


class DogBriefSerializer(CamelCaseSerializerMixin, serializers.ModelSerializer):
    class Meta:
        model = Dog
        fields = ("id", "name")


class DogListSerializer(CamelCaseSerializerMixin, serializers.ModelSerializer):
    """Сериализатор для списка щенков"""

    breed = BreedBriefSerializer(read_only=True)
    status = serializers.SerializerMethodField()
    sex = serializers.SerializerMethodField()
    potential = serializers.SerializerMethodField()
    photos = DogPhotosSerializer(many=True, read_only=True)
    documents = DogDocumentsSerializer(many=True, read_only=True)
    parents = serializers.SerializerMethodField()

    class Meta:
        model = Dog
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

    def _build_enum_payload(self, value: str, enum_cls):
        if value is None:
            return None
        try:
            enum_member = enum_cls(value)
            return {"code": enum_member.value, "label": enum_member.label}
        except ValueError:
            # На случай старых нестандартных значений оставляем код как есть
            return {"code": value, "label": value}

    def get_status(self, obj: Dog):
        return self._build_enum_payload(obj.status, DogStatus)

    def get_sex(self, obj: Dog):
        return self._build_enum_payload(obj.sex, DogSex)

    def get_potential(self, obj: Dog):
        return self._build_enum_payload(obj.potential, DogPotential)

    def get_parents(self, obj: Dog):
        """
        Возвращает словарь с информацией о родителях щенка:
        {
          "mother": {"id": <dog_id>, "name": <dog_name>},
          "father": {"id": <dog_id>, "name": <dog_name>},
        }
        """
        links = DogParent.objects.filter(child=obj).select_related("parent")
        if not links:
            return None

        result = {}
        for link in links:
            parent_data = {
                "id": str(link.parent_id),
                "name": link.parent.name,
            }
            if link.role == DogParent.ROLE_MOTHER:
                result["mother"] = parent_data
            elif link.role == DogParent.ROLE_FATHER:
                result["father"] = parent_data

        return result or None


class DogByBreedListSerializer(CamelCaseSerializerMixin, serializers.ModelSerializer):
    """Сериализатор для списка щенков по породе."""

    breed = BreedBriefSerializer(read_only=True)
    status = serializers.SerializerMethodField()
    sex = serializers.SerializerMethodField()
    potential = serializers.SerializerMethodField()
    photos = DogPhotosSerializer(many=True, read_only=True)
    documents = DogDocumentsSerializer(many=True, read_only=True)

    class Meta:
        model = Dog
        fields = "__all__"

    def _build_enum_payload(self, value: str, enum_cls):
        if value is None:
            return None
        try:
            enum_member = enum_cls(value)
            return {"code": enum_member.value, "label": enum_member.label}
        except ValueError:
            return {"code": value, "label": value}

    def get_status(self, obj: Dog):
        return self._build_enum_payload(obj.status, DogStatus)

    def get_sex(self, obj: Dog):
        return self._build_enum_payload(obj.sex, DogSex)

    def get_potential(self, obj: Dog):
        return self._build_enum_payload(obj.potential, DogPotential)


class RatingBlockSerializer(serializers.Serializer):
    """Вспомогательный сериализатор для блока rating + text."""

    rating = serializers.IntegerField()
    text = serializers.CharField()


class BreedDescriptionSerializer(CamelCaseSerializerMixin, serializers.Serializer):
    """Описание породы с полями, сгруппированными как на фронте (блоки rating + text)."""

    appearance = serializers.CharField()
    character = RatingBlockSerializer()
    adaptability = RatingBlockSerializer()
    care = RatingBlockSerializer()
    activity = RatingBlockSerializer()

    def to_representation(self, instance: BreedDescription):
        data = {
            "appearance": instance.appearance,
            "character": {
                "rating": instance.character_rating,
                "text": instance.character_text,
            },
            "adaptability": {
                "rating": instance.adaptability_rating,
                "text": instance.adaptability_text,
            },
            "care": {
                "rating": instance.care_rating,
                "text": instance.care_text,
            },
            "activity": {
                "rating": instance.activity_rating,
                "text": instance.activity_text,
            },
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
            "dog",
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
        if instance.dog_id is not None:
            data["dog"] = instance.dog.name
        else:
            data["dog"] = None
        if instance.user_id is not None:
            data["user"] = instance.user.email
        else:
            data["user"] = None
        return data
