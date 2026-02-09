from rest_framework import serializers
from common.models import BreedDescription, Puppy, Breed, PuppyStatus, PuppySex, PuppyPotential


def _to_camel_case(snake_str: str) -> str:
    """Преобразует snake_case в camelCase."""
    parts = snake_str.split("_")
    return parts[0].lower() + "".join(p.capitalize() for p in parts[1:])


def _keys_to_camel_case(data):
    """Рекурсивно преобразует все ключи словарей в camelCase."""
    if isinstance(data, dict):
        return {_to_camel_case(k): _keys_to_camel_case(v) for k, v in data.items()}
    if isinstance(data, list):
        return [_keys_to_camel_case(item) for item in data]
    return data


class CamelCaseSerializerMixin:
    """Миксин: результат to_representation отдаётся с ключами в camelCase."""

    def to_representation(self, instance):
        data = super().to_representation(instance)
        return _keys_to_camel_case(data)


class BreedBriefSerializer(CamelCaseSerializerMixin, serializers.ModelSerializer):
    """Краткое представление породы для списка щенков."""

    class Meta:
        model = Breed
        fields = ("id", "slug", "name", "full_name")


class PuppyStatusSerializer(CamelCaseSerializerMixin, serializers.ModelSerializer):
    class Meta:
        model = PuppyStatus
        fields = ("id", "code", "label")


class PuppySexSerializer(CamelCaseSerializerMixin, serializers.ModelSerializer):
    class Meta:
        model = PuppySex
        fields = ("id", "code", "label")


class PuppyPotentialSerializer(CamelCaseSerializerMixin, serializers.ModelSerializer):
    class Meta:
        model = PuppyPotential
        fields = ("id", "code", "label")


class PuppyListSerializer(CamelCaseSerializerMixin, serializers.ModelSerializer):
    """Сериализатор для списка щенков."""

    breed = BreedBriefSerializer(read_only=True)
    status = PuppyStatusSerializer(read_only=True)
    sex = PuppySexSerializer(read_only=True)
    potential = PuppyPotentialSerializer(read_only=True)
    photos = serializers.SerializerMethodField()

    class Meta:
        model = Puppy
        fields = (
            "id",
            "name",
            "breed",
            "status",
            "birth_date",
            "sex",
            "color",
            "potential",
            "description",
            "photos",
        )

    def get_photos(self, obj):
        return [
            {"id": str(p.id), "url": p.photo.url}
            for p in obj.photos.all()
        ]

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

    class Meta:
        model = Breed
        fields = ("id", "slug", "name", "full_name", "description")