from django.contrib import admin
from django.utils.safestring import mark_safe

from common.models import Breed, BreedDescription, Puppy, PuppyParents, PuppyPhoto, PuppyStatus, PuppySex, PuppyPotential, PuppyDocument


class BreedDescriptionInline(admin.StackedInline):
    model = BreedDescription
    extra = 0
    max_num = 1
    min_num = 1
    fields = (
        "appearance",
        ("character_rating", "character_text"),
        ("adaptability_rating", "adaptability_text"),
        ("care_rating", "care_text"),
        ("activity_rating", "activity_text"),
    )

class PuppyParentsInline(admin.StackedInline):
    model = PuppyParents
    fk_name = "puppy"
    extra = 0
    max_num = 1


class PuppyPhotoInline(admin.TabularInline):
    model = PuppyPhoto
    extra = 1
    min_num = 1
    fields = ("order", "photo", "photo_preview")
    readonly_fields = ("photo_preview",)

    def photo_preview(self, obj):
        if obj and obj.photo:
            return mark_safe(f'<img src="{obj.photo.url}" style="max-height: 80px;" />')
        return "—"

    photo_preview.short_description = "Превью"


class PuppyDocumentInline(admin.TabularInline):
    model = PuppyDocument
    extra = 1
    fields = ("name", "file")

@admin.register(PuppyStatus)
class PuppyStatusAdmin(admin.ModelAdmin):
    list_display = ("code", "label")


@admin.register(PuppySex)
class PuppySexAdmin(admin.ModelAdmin):
    list_display = ("code", "label")


@admin.register(PuppyPotential)
class PuppyPotentialAdmin(admin.ModelAdmin):
    list_display = ("code", "label")


@admin.register(Breed)
class BreedAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "full_name", "photo_preview_list")
    inlines = [BreedDescriptionInline]
    readonly_fields = ("photo_preview",)
    fieldsets = (
        (None, {"fields": ("name", "full_name", "photo", "photo_preview")}),
    )

    def photo_preview(self, obj):
        if obj and obj.photo:
            return mark_safe(f'<img src="{obj.photo.url}" style="max-height: 200px;" />')
        return "—"

    photo_preview.short_description = "Превью"

    def photo_preview_list(self, obj):
        if obj and obj.photo:
            return mark_safe(f'<img src="{obj.photo.url}" style="max-height: 40px;" />')
        return "—"

    photo_preview_list.short_description = "Фото"

@admin.register(Puppy)
class PuppyAdmin(admin.ModelAdmin):
    list_display = ("name", "international_name", "breed", "status", "birth_date", "sex", "color", "potential", "photos_count")
    inlines = [PuppyPhotoInline, PuppyDocumentInline, PuppyParentsInline]
    fieldsets = (
        (None, {"fields": ("name", "breed", "status", "birth_date", "sex", "color", "potential", "description")}),
    )

    def photos_count(self, obj):
        if obj and obj.pk:
            return obj.photos.count()
        return 0

    photos_count.short_description = "Фото"