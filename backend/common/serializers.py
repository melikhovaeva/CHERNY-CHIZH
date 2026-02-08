from rest_framework import serializers
from common.models import Puppy, Breed, PuppyStatus, PuppySex, PuppyPotential


class BreedBriefSerializer(serializers.ModelSerializer):
    """Краткое представление породы для списка щенков."""

    class Meta:
        model = Breed
        fields = ("id", "slug", "name", "full_name")


class PuppyStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = PuppyStatus
        fields = ("id", "code", "label")


class PuppySexSerializer(serializers.ModelSerializer):
    class Meta:
        model = PuppySex
        fields = ("id", "code", "label")


class PuppyPotentialSerializer(serializers.ModelSerializer):
    class Meta:
        model = PuppyPotential
        fields = ("id", "code", "label")


class PuppyListSerializer(serializers.ModelSerializer):
    """Сериализатор для списка щенков."""

    breed = BreedBriefSerializer(read_only=True)
    status = PuppyStatusSerializer(read_only=True)
    sex = PuppySexSerializer(read_only=True)
    potential = PuppyPotentialSerializer(read_only=True)

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
