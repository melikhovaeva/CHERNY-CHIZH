from rest_framework import serializers

from consumer.models import (
    AboutMilestone,
    AboutPage,
    AboutValue,
    ContactInfo,
    ContactsPage,
    FAQItem,
    Schedule,
    SocialLink,
)


class FAQItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQItem
        fields = ("id", "title", "content", "category")


# ────────────────────────────────────────────
# О нас
# ────────────────────────────────────────────


class AboutValueSerializer(serializers.ModelSerializer):
    class Meta:
        model = AboutValue
        fields = ("id", "title", "description", "order")


class AboutMilestoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = AboutMilestone
        fields = ("id", "year", "text", "order")


class AboutPageSerializer(serializers.ModelSerializer):
    values = AboutValueSerializer(many=True, read_only=True)
    milestones = AboutMilestoneSerializer(many=True, read_only=True)

    class Meta:
        model = AboutPage
        fields = (
            "title",
            "subtitle",
            "mission_title",
            "mission_text",
            "cta_title",
            "cta_text",
            "values",
            "milestones",
        )


# ────────────────────────────────────────────
# Контакты
# ────────────────────────────────────────────


class ContactInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactInfo
        fields = ("id", "contact_type", "label", "value", "href", "order")


class SocialLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialLink
        fields = ("id", "name", "label", "value", "href", "order")


class ScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Schedule
        fields = ("id", "days", "hours", "order")


class ContactsPageSerializer(serializers.ModelSerializer):
    contacts = ContactInfoSerializer(many=True, read_only=True)
    socials = SocialLinkSerializer(many=True, read_only=True)
    schedule = ScheduleSerializer(many=True, read_only=True)

    class Meta:
        model = ContactsPage
        fields = (
            "title",
            "subtitle",
            "address",
            "address_note",
            "banner_title",
            "banner_text",
            "banner_email",
            "contacts",
            "socials",
            "schedule",
        )
