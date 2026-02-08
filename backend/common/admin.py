from django.contrib import admin

from common.models import Breed, BreedDescription, Puppy, PuppyParents, PuppyStatus, PuppySex, PuppyPotential


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
    list_display = ("name", "slug", "full_name")
    inlines = [BreedDescriptionInline]

@admin.register(Puppy)
class PuppyAdmin(admin.ModelAdmin):
    list_display = ("name", "international_name", "breed", "status", "birth_date", "sex", "color", "potential")
    inlines = [PuppyParentsInline]