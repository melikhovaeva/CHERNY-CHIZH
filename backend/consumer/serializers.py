from rest_framework import serializers

from consumer.models import FAQItem


class FAQItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQItem
        fields = ("id", "title", "content", "category")

