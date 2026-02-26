from rest_framework import serializers

from common.serializers import CamelCaseSerializerMixin
from education.models import (
    Article,
    Course,
    CourseEnrollment,
    CourseLesson,
    CourseStep,
    CourseTask,
    CourseTaskAnswer,
    CourseTaskQuestion,
    InfoStatus,
    InfoTag,
)


class InfoTagSerializer(CamelCaseSerializerMixin, serializers.ModelSerializer):
    class Meta:
        model = InfoTag
        fields = ("id", "code", "label", "order")


class ArticleSerializer(CamelCaseSerializerMixin, serializers.ModelSerializer):
    status = serializers.SerializerMethodField()
    tags = InfoTagSerializer(many=True, read_only=True)

    class Meta:
        model = Article
        fields = (
            "id",
            "title",
            "slug",
            "description",
            "image_preview",
            "status",
            "tags",
            "content",
            "created_at",
            "updated_at",
        )

    def get_status(self, obj: Article):
        if not obj.status:
            return None
        try:
            status_enum = InfoStatus(obj.status)
            return {"code": status_enum.value, "label": status_enum.label}
        except ValueError:
            return {"code": obj.status, "label": obj.status}


class ArticleBriefSerializer(CamelCaseSerializerMixin, serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = ("id", "title", "slug")


class CourseTaskAnswerSerializer(CamelCaseSerializerMixin, serializers.ModelSerializer):
    class Meta:
        model = CourseTaskAnswer
        fields = ("id", "order", "text", "is_correct")


class CourseTaskQuestionSerializer(
    CamelCaseSerializerMixin, serializers.ModelSerializer
):
    answers = CourseTaskAnswerSerializer(many=True, read_only=True)

    class Meta:
        model = CourseTaskQuestion
        fields = ("id", "order", "text", "answers")


class CourseTaskSerializer(CamelCaseSerializerMixin, serializers.ModelSerializer):
    questions = CourseTaskQuestionSerializer(many=True, read_only=True)

    class Meta:
        model = CourseTask
        fields = ("id", "order", "title", "description", "questions")


class CourseLessonSerializer(CamelCaseSerializerMixin, serializers.ModelSerializer):
    article = ArticleBriefSerializer(read_only=True)
    tasks = CourseTaskSerializer(many=True, read_only=True)

    class Meta:
        model = CourseLesson
        fields = ("id", "order", "title", "article", "tasks")


class CourseStepSerializer(CamelCaseSerializerMixin, serializers.ModelSerializer):
    lessons = CourseLessonSerializer(many=True, read_only=True)

    class Meta:
        model = CourseStep
        fields = ("id", "order", "title", "lessons")


class CourseSerializer(CamelCaseSerializerMixin, serializers.ModelSerializer):
    status = serializers.SerializerMethodField()
    tags = InfoTagSerializer(many=True, read_only=True)

    class Meta:
        model = Course
        fields = (
            "id",
            "title",
            "slug",
            "description",
            "image_preview",
            "action_text",
            "difficulty",
            "status",
            "tags",
            "created_at",
            "updated_at",
        )

    def get_status(self, obj: Course):
        if not obj.status:
            return None
        try:
            status_enum = InfoStatus(obj.status)
            return {"code": status_enum.value, "label": status_enum.label}
        except ValueError:
            return {"code": obj.status, "label": obj.status}


class CourseDetailSerializer(CourseSerializer):
    steps = CourseStepSerializer(many=True, read_only=True)

    class Meta(CourseSerializer.Meta):
        fields = CourseSerializer.Meta.fields + ("steps",)


class CourseEnrollmentSerializer(CamelCaseSerializerMixin, serializers.ModelSerializer):
    course = CourseSerializer(read_only=True)

    class Meta:
        model = CourseEnrollment
        fields = (
            "id",
            "course",
            "status",
            "progress",
            "started_at",
            "completed_at",
        )

