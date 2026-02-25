from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework import permissions, viewsets

from education.models import Article, Course
from education.serializers import (
    ArticleSerializer,
    CourseDetailSerializer,
    CourseSerializer,
)


@extend_schema_view(
    list=extend_schema(
        summary="Список статей",
        description="Возвращает список статей с краткой информацией.",
        tags=["Articles"],
    ),
    retrieve=extend_schema(
        summary="Детали статьи",
        description="Возвращает полное содержимое одной статьи.",
        tags=["Articles"],
    ),
)
class ArticleViewSet(viewsets.ReadOnlyModelViewSet):
    """Публичный API для статей."""

    permission_classes = [permissions.AllowAny]
    serializer_class = ArticleSerializer

    def get_queryset(self):
        return (
            Article.objects.select_related("status")
            .prefetch_related("tags")
            .order_by("-created_at")
        )


@extend_schema_view(
    list=extend_schema(
        summary="Список курсов",
        description="Возвращает список доступных курсов.",
        tags=["Courses"],
    ),
    retrieve=extend_schema(
        summary="Детали курса",
        description="Возвращает полную структуру курса со ступенями, уроками и заданиями.",
        tags=["Courses"],
    ),
)
class CourseViewSet(viewsets.ReadOnlyModelViewSet):
    """Публичный API для курсов."""

    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return (
            Course.objects.select_related("status")
            .prefetch_related(
                "tags",
                "steps__lessons__tasks__questions__answers",
            )
            .order_by("id")
        )

    def get_serializer_class(self):
        if self.action == "retrieve":
            return CourseDetailSerializer
        return CourseSerializer

