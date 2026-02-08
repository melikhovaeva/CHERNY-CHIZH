from rest_framework import serializers
from common.models import Puppy, Breed


class BreedBriefSerializer(serializers.ModelSerializer):
    """Краткое представление породы для списка щенков."""

    class Meta:
        model = Breed
        fields = ("id", "name", "full_name")


class PuppyListSerializer(serializers.ModelSerializer):
    """Сериализатор для списка щенков."""

    breed = BreedBriefSerializer(read_only=True)

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
        )
