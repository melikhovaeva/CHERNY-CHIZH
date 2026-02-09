from rest_framework import serializers
from common.models import BreedDescription, Puppy, Breed, PuppyParents, PuppyPhoto, PuppyStatus, PuppySex, PuppyPotential, PuppyDocument


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


class BreedBriefSerializer(CamelCaseSerializerMixin, serializers.ModelSerializer):
    """Краткое представление породы для списка щенков"""

    photo = serializers.SerializerMethodField()

    class Meta:
        model = Breed
        fields = ("slug", "name", "full_name", "photo")

    def get_photo(self, obj):
        return obj.photo.url if obj.photo else None


class PuppyStatusSerializer(CamelCaseSerializerMixin, serializers.ModelSerializer):
    class Meta:
        model = PuppyStatus
        fields = ("code", "label")


class PuppySexSerializer(CamelCaseSerializerMixin, serializers.ModelSerializer):
    class Meta:
        model = PuppySex
        fields = ("code", "label")


class PuppyPotentialSerializer(CamelCaseSerializerMixin, serializers.ModelSerializer):
    class Meta:
        model = PuppyPotential
        fields = ("code", "label")


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


class PuppyParentsSerializer(CamelCaseSerializerMixin, serializers.ModelSerializer):
    mother = PuppyBriefSerializer(read_only=True)
    father = PuppyBriefSerializer(read_only=True)

    class Meta:
        model = PuppyParents
        fields = ("mother", "father")

    def get_mother(self, obj):
        return obj.mother.name if obj.mother else None

    def get_father(self, obj):
        return obj.father.name if obj.father else None

class PuppyListSerializer(CamelCaseSerializerMixin, serializers.ModelSerializer):
    """Сериализатор для списка щенков"""

    breed = BreedBriefSerializer(read_only=True)
    status = PuppyStatusSerializer(read_only=True)
    sex = PuppySexSerializer(read_only=True)
    potential = PuppyPotentialSerializer(read_only=True)
    photos = PuppyPhotosSerializer(many=True, read_only=True)
    documents = PuppyDocumentsSerializer(many=True, read_only=True)
    parents = PuppyParentsSerializer(read_only=True)

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

class PuppyByBreedListSerializer(CamelCaseSerializerMixin, serializers.ModelSerializer):
    """Сериализатор для списка щенков по породе."""

    breed = BreedBriefSerializer(read_only=True)
    status = PuppyStatusSerializer(read_only=True)
    sex = PuppySexSerializer(read_only=True)
    potential = PuppyPotentialSerializer(read_only=True)
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