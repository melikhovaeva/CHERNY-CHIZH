from django.contrib import admin

from education.models import (
    Article,
    Course,
    CourseEnrollment,
    CourseLesson,
    CourseStep,
    CourseTask,
    CourseTaskAnswer,
    CourseTaskQuestion,
    InfoTag,
)


@admin.register(InfoTag)
class InfoTagAdmin(admin.ModelAdmin):
    list_display = ("code", "label", "order")
    list_editable = ("order",)
    search_fields = ("code", "label")


@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "get_author_display",
        "status",
        "breed",
        "created_at",
        "updated_at",
    )
    list_filter = ("status", "tags", "created_at")
    list_editable = ("status",)
    search_fields = ("title", "description", "content", "author_text")
    prepopulated_fields = {"slug": ("title",)}
    raw_id_fields = ("author", "breed")
    readonly_fields = ("created_at", "updated_at")
    date_hierarchy = "created_at"
    list_per_page = 25
    list_select_related = ("author", "breed")
    fieldsets = (
        (
            None,
            {
                "fields": ("title", "slug", "description", "image_preview", "status", "tags", "breed"),
            },
        ),
        (
            "Автор",
            {
                "fields": ("author", "author_text"),
                "description": "Укажите пользователя-автора или текст автора (например, «Редакция»). Если выбран пользователь, author_text не используется на сайте.",
            },
        ),
        (
            "Контент (Markdown)",
            {
                "fields": ("content",),
                "description": "Контент статьи в формате Markdown. Поддерживаются заголовки, списки, ссылки, код и т.д.",
            },
        ),
        (
            "Даты",
            {
                "fields": ("created_at", "updated_at"),
                "classes": ("collapse",),
            },
        ),
    )

    @admin.display(description="Автор")
    def get_author_display(self, obj):
        if obj.author_id and obj.author:
            name = f"{obj.author.first_name or ''} {obj.author.last_name or ''}".strip()
            return name or obj.author.email
        if obj.author_text:
            return obj.author_text
        return "—"

    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        if "content" in form.base_fields:
            form.base_fields["content"].help_text = "Используйте синтаксис Markdown: # заголовок, ## подзаголовок, **жирный**, [ссылка](url)."
            form.base_fields["content"].widget.attrs.setdefault("rows", 20)
        return form


class CourseStepInline(admin.TabularInline):
    model = CourseStep
    extra = 1


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ("title", "difficulty", "status", "created_at", "updated_at")
    list_filter = ("difficulty", "status", "tags")
    search_fields = ("title", "description")
    prepopulated_fields = {"slug": ("title",)}
    inlines = [CourseStepInline]


class CourseLessonInline(admin.TabularInline):
    model = CourseLesson
    extra = 1


@admin.register(CourseStep)
class CourseStepAdmin(admin.ModelAdmin):
    list_display = ("title", "course", "order")
    list_filter = ("course",)
    ordering = ("course", "order", "id")
    inlines = [CourseLessonInline]


class CourseTaskInline(admin.TabularInline):
    model = CourseTask
    extra = 1


@admin.register(CourseLesson)
class CourseLessonAdmin(admin.ModelAdmin):
    list_display = ("title", "step", "order")
    list_filter = ("step",)
    ordering = ("step", "order", "id")
    inlines = [CourseTaskInline]


class CourseTaskQuestionInline(admin.TabularInline):
    model = CourseTaskQuestion
    extra = 1


@admin.register(CourseTask)
class CourseTaskAdmin(admin.ModelAdmin):
    list_display = ("title", "lesson", "order")
    list_filter = ("lesson",)
    ordering = ("lesson", "order", "id")
    inlines = [CourseTaskQuestionInline]


class CourseTaskAnswerInline(admin.TabularInline):
    model = CourseTaskAnswer
    extra = 2


@admin.register(CourseTaskQuestion)
class CourseTaskQuestionAdmin(admin.ModelAdmin):
    list_display = ("text", "task", "order")
    list_filter = ("task",)
    ordering = ("task", "order", "id")
    inlines = [CourseTaskAnswerInline]


@admin.register(CourseTaskAnswer)
class CourseTaskAnswerAdmin(admin.ModelAdmin):
    list_display = ("text", "question", "is_correct", "order")
    list_filter = ("question", "is_correct")
    ordering = ("question", "order", "id")


@admin.register(CourseEnrollment)
class CourseEnrollmentAdmin(admin.ModelAdmin):
    list_display = ("user", "course", "status", "progress", "started_at", "completed_at")
    list_filter = ("status", "course")
    search_fields = ("user__email", "course__title")
    raw_id_fields = ("user", "course")

