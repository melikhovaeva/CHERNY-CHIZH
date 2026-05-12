from django.contrib import admin

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


@admin.register(FAQItem)
class FAQItemAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "category")
    list_filter = ("category",)
    search_fields = ("title", "content")


# ────────────────────────────────────────────
# О нас
# ────────────────────────────────────────────


class AboutValueInline(admin.TabularInline):
    model = AboutValue
    extra = 1
    fields = ("order", "title", "description")


class AboutMilestoneInline(admin.TabularInline):
    model = AboutMilestone
    extra = 1
    fields = ("order", "year", "text")


@admin.register(AboutPage)
class AboutPageAdmin(admin.ModelAdmin):
    inlines = [AboutValueInline, AboutMilestoneInline]
    fieldsets = (
        ("Герой", {"fields": ("title", "subtitle")}),
        ("Миссия", {"fields": ("mission_title", "mission_text")}),
        ("Призыв к действию", {"fields": ("cta_title", "cta_text")}),
    )

    def has_add_permission(self, request):
        return not AboutPage.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False


# ────────────────────────────────────────────
# Контакты
# ────────────────────────────────────────────


class ContactInfoInline(admin.TabularInline):
    model = ContactInfo
    extra = 1
    fields = ("order", "contact_type", "label", "value", "href")


class SocialLinkInline(admin.TabularInline):
    model = SocialLink
    extra = 1
    fields = ("order", "name", "label", "value", "href")


class ScheduleInline(admin.TabularInline):
    model = Schedule
    extra = 1
    fields = ("order", "days", "hours")


@admin.register(ContactsPage)
class ContactsPageAdmin(admin.ModelAdmin):
    inlines = [ContactInfoInline, SocialLinkInline, ScheduleInline]
    fieldsets = (
        ("Шапка", {"fields": ("title", "subtitle")}),
        ("Адрес", {"fields": ("address", "address_note")}),
        ("Баннер", {"fields": ("banner_title", "banner_text", "banner_email")}),
    )

    def has_add_permission(self, request):
        return not ContactsPage.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False
