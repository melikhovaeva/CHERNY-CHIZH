from django.db.models import Count, Q

from common.pagination import DogPagination
from education.schema import (
    article_view_schema,
    course_view_schema,
    education_article_view_schema,
    education_course_view_schema,
    education_tag_view_schema,
    extend_schema_view,
)
from rest_framework import permissions, status, viewsets, mixins
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


@extend_schema_view(**article_view_schema)
class ArticleViewSet(viewsets.ReadOnlyModelViewSet):
    """Публичный API для статей."""

    permission_classes = [permissions.AllowAny]
    lookup_field = "slug"
    lookup_url_kwarg = "slug"
    pagination_class = DogPagination

    def get_queryset(self):
        qs = (
            Article.objects.filter(status=InfoStatus.PUBLISHED)
            .select_related("author")
            .prefetch_related("tags")
            .order_by("-created_at")
        )
        if getattr(self, "action", None) == "list":
            qs = qs.filter(breed__isnull=True)
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
        published = Article.objects.filter(
            status=InfoStatus.PUBLISHED, breed__isnull=True
        )
        tag_ids_qs = (
            InfoTag.objects.annotate(
                article_count=Count(
                    "articles",
                    filter=Q(
                        articles__status=InfoStatus.PUBLISHED,
                        articles__breed__isnull=True,
                    ),
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


@extend_schema_view(**course_view_schema)
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


@extend_schema_view(**education_article_view_schema)
class EducationArticleViewSet(ArticleViewSet):
    """Публичный API для статей под префиксом /education."""

    pass


@extend_schema_view(**education_course_view_schema)
class EducationCourseViewSet(CourseViewSet):
    """Публичный API для курсов под префиксом /education."""

    pass


@extend_schema_view(**education_tag_view_schema)
class EducationTagViewSet(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    viewsets.GenericViewSet,
):
    """Список и массовое создание тегов под префиксом /education."""

    queryset = InfoTag.objects.all().order_by("order", "id")
    serializer_class = InfoTagSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def create(self, request, *args, **kwargs):
        is_many = isinstance(request.data, list)
        serializer = self.get_serializer(data=request.data, many=is_many)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

