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
    list_display = ("title", "status", "created_at", "updated_at")
    list_filter = ("status", "tags")
    search_fields = ("title", "description", "content")
    prepopulated_fields = {"slug": ("title",)}


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

