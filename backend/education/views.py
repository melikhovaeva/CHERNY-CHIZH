from django.db.models import Count, Q

from common.pagination import DogPagination
from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework import permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from education.models import Article, Course, InfoStatus, InfoTag
from education.serializers import (
    ArticleListSerializer,
    ArticleMinimalSerializer,
    ArticleSerializer,
    CourseDetailSerializer,
    CourseSerializer,
    InfoTagSerializer,
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
    home_library=extend_schema(
        summary="Блок «База знаний» для главной",
        description="Теги с не менее чем 3 статьями (макс. 4 тега), для каждого — минимум 3 статьи. Только опубликованные статьи.",
        tags=["Articles"],
    ),
)
class ArticleViewSet(viewsets.ReadOnlyModelViewSet):
    """Публичный API для статей."""

    permission_classes = [permissions.AllowAny]
    lookup_field = "slug"
    lookup_url_kwarg = "slug"
    pagination_class = DogPagination

    def get_queryset(self):
        qs = (
            Article.objects.filter(status=InfoStatus.PUBLISHED)
            .prefetch_related("tags")
            .order_by("-created_at")
        )
        search = self.request.query_params.get("search", "").strip()
        if search:
            qs = qs.filter(
                Q(title__icontains=search) | Q(description__icontains=search)
            )
        return qs

    def get_serializer_class(self):
        if self.action == "list":
            return ArticleListSerializer
        return ArticleSerializer

    @action(detail=False, url_path="home-library")
    def home_library(self, request):
        published = Article.objects.filter(status=InfoStatus.PUBLISHED)
        tag_ids_qs = (
            InfoTag.objects.annotate(
                article_count=Count(
                    "articles", filter=Q(articles__status=InfoStatus.PUBLISHED)
                )
            )
            .filter(article_count__gte=3)
            .order_by("order", "id")[:4]
        )
        selected_tags = list(tag_ids_qs)
        tags_data = InfoTagSerializer(selected_tags, many=True).data
        groups = []
        for tag in selected_tags:
            articles = (
                published.filter(tags=tag)
                .order_by("-created_at")[:12]
            )
            articles_data = ArticleMinimalSerializer(articles, many=True).data
            groups.append({"tagId": tag.id, "articles": articles_data})
        return Response({"tags": tags_data, "groups": groups})


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
        return Course.objects.prefetch_related(
            "tags",
            "steps__lessons__tasks__questions__answers",
        ).order_by("id")

    def get_serializer_class(self):
        if self.action == "retrieve":
            return CourseDetailSerializer
        return CourseSerializer

