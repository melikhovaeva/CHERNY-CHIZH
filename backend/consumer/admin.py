from django.contrib import admin

from consumer.models import FAQItem


@admin.register(FAQItem)
class FAQItemAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "category")
    list_filter = ("category",)
    search_fields = ("title", "content")

