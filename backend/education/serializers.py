from rest_framework import serializers

from common.serializers import CamelCaseSerializerMixin, CodeLabelSerializer
from education.schema import extend_schema_field
from education.markdown_utils import markdown_to_safe_html
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


def _article_author_display_name(article: Article) -> str:
    """Имя автора: для пользователя — «Имя Ф.» (инициал фамилии), иначе author_text."""
    if article.author_id and article.author:
        user = article.author
        parts = [user.first_name or ""]
        if user.last_name:
            parts.append(f"{user.last_name[0].upper()}.")
        return " ".join(filter(None, parts)).strip() or user.email
    return (article.author_text or "").strip()


class ArticleListSerializer(CamelCaseSerializerMixin, serializers.ModelSerializer):
    """Минимальный набор полей для списка статей (карточки, ссылки)."""

    tags = InfoTagSerializer(many=True, read_only=True)
    author = serializers.SerializerMethodField()

    class Meta:
        model = Article
        fields = (
            "id",
            "title",
            "slug",
            "description",
            "image_preview",
            "tags",
            "created_at",
            "author",
        )

    def get_author(self, obj: Article) -> dict:
        if obj.author_id and obj.author:
            avatar = None
            if obj.author.avatar_image:
                avatar = obj.author.avatar_image.url
            return {
                "avatar": avatar,
                "display_name": _article_author_display_name(obj),
            }
        display = _article_author_display_name(obj)
        if not display:
            return None
        return {"avatar": None, "display_name": display}


class ArticleSerializer(CamelCaseSerializerMixin, serializers.ModelSerializer):
    status = serializers.SerializerMethodField()
    content_html = serializers.SerializerMethodField()
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
            "content_html",
            "created_at",
            "updated_at",
        )

    def get_content_html(self, obj: Article) -> str:
        return markdown_to_safe_html(obj.content or "")

    @extend_schema_field(CodeLabelSerializer)
    def get_status(self, obj: Article):
        if not obj.status:
            return None
        try:
            status_enum = InfoStatus(obj.status)
            return {"code": status_enum.value, "label": status_enum.label}
        except ValueError:
            return {"code": obj.status, "label": obj.status}


class ArticleMinimalSerializer(CamelCaseSerializerMixin, serializers.ModelSerializer):
    """Минимальный набор полей для карточки статьи (блок home_library)."""

    class Meta:
        model = Article
        fields = ("id", "title", "slug", "description", "image_preview")


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

    @extend_schema_field(CodeLabelSerializer)
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

