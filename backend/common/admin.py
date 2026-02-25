from django.contrib import admin
from django.utils.safestring import mark_safe

from common.models import (
    Breed,
    BreedDescription,
    Dog,
    DogDocument,
    DogParent,
    DogPhoto,
    Request,
)


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


class DogParentInline(admin.TabularInline):
    model = DogParent
    fk_name = "child"
    extra = 2
    max_num = 2
    fields = ("role", "parent")

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "parent":
            breed_id = getattr(request, "_dog_breed_id", None)
            if breed_id is not None:
                kwargs["queryset"] = Dog.objects.filter(breed_id=breed_id)
        return super().formfield_for_foreignkey(db_field, request, **kwargs)


class DogPhotoInline(admin.TabularInline):
    model = DogPhoto
    extra = 1
    min_num = 1
    fields = ("order", "photo", "photo_preview")
    readonly_fields = ("photo_preview",)

    def photo_preview(self, obj):
        if obj and obj.photo:
            return mark_safe(f'<img src="{obj.photo.url}" style="max-height: 80px;" />')
        return "—"

    photo_preview.short_description = "Превью"


class DogDocumentInline(admin.TabularInline):
    model = DogDocument
    extra = 0
    fields = ("name", "file")


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


@admin.register(Dog)
class DogAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "international_name",
        "breed",
        "age_group",
        "status",
        "birth_date",
        "sex",
        "color",
        "potential",
        "photos_count",
    )
    list_filter = ("age_group", "breed", "status", "sex")
    inlines = [DogPhotoInline, DogDocumentInline, DogParentInline]
    fieldsets = (
        (
            None,
            {
                "fields": (
                    "name",
                    "breed",
                    "age_group",
                    "status",
                    "birth_date",
                    "sex",
                    "color",
                    "potential",
                    "description",
                )
            },
        ),
    )

    def get_form(self, request, obj=None, **kwargs):
        if obj is not None:
            request._dog_breed_id = obj.breed_id
        return super().get_form(request, obj, **kwargs)

    def photos_count(self, obj):
        if obj and obj.pk:
            return obj.photos.count()
        return 0

    photos_count.short_description = "Фото"


@admin.register(Request)
class RequestAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "first_name", "last_name", "email", "phone", "messenger", "dog")
    list_filter = ("user",)
    search_fields = ("first_name", "last_name", "email", "message")
    raw_id_fields = ("user", "dog")
