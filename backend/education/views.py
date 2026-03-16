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
from user_management.permissions import IsAdmin

from common.serializers import keys_to_snake_case
from education.constants import (
    COURSE_IMAGE_ALLOWED_CONTENT_TYPES,
    COURSE_IMAGE_MAX_SIZE_BYTES,
    COURSE_IMAGE_UPLOAD_FIELD_NAME,
)
from education.models import Article, Course, InfoStatus, InfoTag
from education.serializers import (
    ArticleListSerializer,
    ArticleMinimalSerializer,
    ArticleSerializer,
    CourseCreateUpdateSerializer,
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
        qs = Course.objects.prefetch_related(
            "tags",
            "steps__lessons__tasks__questions__answers",
        ).order_by("id")

        user = getattr(self, "request", None) and getattr(self.request, "user", None)
        if user is not None and getattr(user, "is_superuser", False):
            return qs

        return qs.filter(status=InfoStatus.PUBLISHED)

    def get_serializer_class(self):
        if self.action == "retrieve":
            return CourseDetailSerializer
        return CourseSerializer


@extend_schema_view(**education_article_view_schema)
class EducationArticleViewSet(ArticleViewSet):
    """Публичный API для статей под префиксом /education."""

    pass


@extend_schema_view(**education_course_view_schema)
class EducationCourseViewSet(
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    CourseViewSet,
):
    """
    API курсов под префиксом /education.
    Чтение (list, retrieve) — для всех; создание, обновление, удаление и смена статуса — только для администраторов.
    """

    def get_permissions(self):
        if self.action in (
            "create",
            "update",
            "partial_update",
            "destroy",
            "upload_image",
        ):
            return [IsAdmin()]
        return [permissions.AllowAny()]

    def get_serializer_class(self):
        if self.action in ("create", "update", "partial_update"):
            return CourseCreateUpdateSerializer
        return super().get_serializer_class()

    def _course_request_data(self, request):
        data = keys_to_snake_case(dict(request.data))
        if hasattr(request.data, "getlist"):
            tags_raw = request.data.getlist("tags")
            if tags_raw:
                data["tags"] = [int(t) for t in tags_raw if str(t).isdigit()]
        return data

    def create(self, request, *args, **kwargs):
        data = self._course_request_data(request)
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        instance = serializer.save()
        return Response(
            CourseSerializer(instance, context=self.get_serializer_context()).data,
            status=status.HTTP_201_CREATED,
        )

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        data = self._course_request_data(request)
        serializer = self.get_serializer(instance, data=data, partial=partial)
        serializer.is_valid(raise_exception=True)
        instance = serializer.save()
        return Response(
            CourseSerializer(instance, context=self.get_serializer_context()).data,
        )

    @action(detail=True, methods=["post"], url_path="upload-image")
    def upload_image(self, request, pk=None):
        course = self.get_object()
        image_file = request.FILES.get(COURSE_IMAGE_UPLOAD_FIELD_NAME)
        if not image_file:
            return Response(
                {"detail": "Файл изображения не передан."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        content_type = getattr(image_file, "content_type", "") or ""
        if content_type not in COURSE_IMAGE_ALLOWED_CONTENT_TYPES:
            return Response(
                {
                    "detail": f"Недопустимый тип файла. Разрешены: {', '.join(COURSE_IMAGE_ALLOWED_CONTENT_TYPES)}."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        if image_file.size > COURSE_IMAGE_MAX_SIZE_BYTES:
            return Response(
                {
                    "detail": f"Размер файла превышает {COURSE_IMAGE_MAX_SIZE_BYTES // (1024 * 1024)} МБ."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        course.image_preview = image_file
        course.save(update_fields=["image_preview"])
        return Response(
            CourseSerializer(course, context=self.get_serializer_context()).data,
        )


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

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()

        raw_query = request.query_params.get("q", "").strip()
        tags = queryset

        if raw_query:
            query = raw_query.lower()
            tags = tags.filter(
                Q(label__icontains=query) | Q(code__icontains=query)
            )
            tags_list = list(tags)

            def get_match_position(tag: InfoTag) -> int | None:
                label = (tag.label or "").lower()
                code = (tag.code or "").lower()
                label_pos = label.find(query)
                code_pos = code.find(query)
                positions = [
                    pos for pos in (label_pos, code_pos) if pos != -1
                ]
                if not positions:
                    return None
                return min(positions)

            scored_tags: list[tuple[int, int, int, InfoTag]] = []
            for tag in tags_list:
                match_pos = get_match_position(tag)
                if match_pos is None:
                    continue
                scored_tags.append(
                    (match_pos, tag.order, tag.id, tag)
                )

            scored_tags.sort(key=lambda item: (item[0], item[1], item[2]))
            ordered_tags = [item[3] for item in scored_tags]
        else:
            ordered_tags = list(tags)

        offset_param = request.query_params.get("offset")
        limit_param = request.query_params.get("limit")

        start_index = 0
        if offset_param is not None:
            try:
                start_index = max(int(offset_param), 0)
            except (TypeError, ValueError):
                start_index = 0

        end_index = None
        if limit_param is not None:
            try:
                limit_value = int(limit_param)
                if limit_value >= 0:
                    end_index = start_index + limit_value
            except (TypeError, ValueError):
                end_index = None

        if end_index is not None:
            sliced_tags = ordered_tags[start_index:end_index]
        else:
            sliced_tags = ordered_tags[start_index:]

        serializer = self.get_serializer(sliced_tags, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        is_many = isinstance(request.data, list)
        serializer = self.get_serializer(data=request.data, many=is_many)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

