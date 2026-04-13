from django.utils import timezone
from rest_framework import serializers

from common.serializers import CamelCaseSerializerMixin, CodeLabelSerializer
from education.schema import extend_schema_field
from education.markdown_utils import article_api_content_blocks
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
  UserTaskAttempt,
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
    content_blocks = serializers.SerializerMethodField()
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
            "content_blocks",
            "created_at",
            "updated_at",
        )

    def get_content_blocks(self, obj: Article) -> list:
        return article_api_content_blocks(obj.content_blocks, obj.content or "")

    @extend_schema_field(CodeLabelSerializer)
    def get_status(self, obj: Article):
        if not obj.status:
            return None
        try:
            status_enum = InfoStatus(obj.status)
            return {"code": status_enum.value, "label": status_enum.label}
        except ValueError:
            return {"code": obj.status, "label": obj.status}


class ArticleAdminReadSerializer(CamelCaseSerializerMixin, serializers.ModelSerializer):
    """Сериализатор чтения статьи для редактора (включает content_blocks)."""

    status = serializers.SerializerMethodField()
    content_blocks = serializers.SerializerMethodField()
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
            "content_blocks",
            "created_at",
            "updated_at",
        )

    def get_content_blocks(self, obj: Article) -> list:
        return article_api_content_blocks(obj.content_blocks, obj.content or "")

    @extend_schema_field(CodeLabelSerializer)
    def get_status(self, obj: Article):
        if not obj.status:
            return None
        try:
            status_enum = InfoStatus(obj.status)
            return {"code": status_enum.value, "label": status_enum.label}
        except ValueError:
            return {"code": obj.status, "label": obj.status}


class ArticleAdminWriteSerializer(CamelCaseSerializerMixin, serializers.ModelSerializer):
    """Сериализатор записи статьи для редактора (title, description, status, content_blocks)."""

    content_blocks = serializers.JSONField(required=False, default=list)

    class Meta:
        model = Article
        fields = ("title", "description", "status", "content_blocks")
        extra_kwargs = {
            "title": {"required": False},
            "description": {"required": False},
            "status": {"required": False},
        }

    def validate_content_blocks(self, value):
        if not isinstance(value, list):
            raise serializers.ValidationError("content_blocks должен быть списком.")
        valid_types = {"text", "image", "video", "file"}
        for block in value:
            if not isinstance(block, dict):
                raise serializers.ValidationError("Каждый блок должен быть объектом.")
            if block.get("type") not in valid_types:
                raise serializers.ValidationError(
                    f"Недопустимый тип блока: {block.get('type')!r}. "
                    f"Допустимые: {', '.join(sorted(valid_types))}."
                )
        return value


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
        fields = ("id", "order", "title", "description", "is_published", "questions")


class CourseLessonSerializer(CamelCaseSerializerMixin, serializers.ModelSerializer):
    article = ArticleBriefSerializer(read_only=True)
    tasks = serializers.SerializerMethodField()

    class Meta:
        model = CourseLesson
        fields = ("id", "order", "title", "article", "tasks")

    def get_tasks(self, obj):
        request = self.context.get("request")
        is_admin = (
            request is not None
            and request.user is not None
            and request.user.is_authenticated
            and getattr(request.user, "is_superuser", False)
        )
        qs = obj.tasks.prefetch_related("questions__answers")
        if not is_admin:
            qs = qs.filter(is_published=True)
        return CourseTaskSerializer(
            qs.order_by("order", "id"),
            many=True,
            context=self.context,
        ).data


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


class CourseCreateUpdateSerializer(CamelCaseSerializerMixin, serializers.ModelSerializer):
    """Сериализатор для создания и обновления курса (админ). Поля: название, описание, текст кнопки, изображение, уровень, теги, статус."""

    tags = serializers.PrimaryKeyRelatedField(
        queryset=InfoTag.objects.all(),
        many=True,
        required=False,
        allow_empty=True,
    )

    class Meta:
        model = Course
        fields = (
            "id",
            "title",
            "slug",
            "description",
            "action_text",
            "image_preview",
            "difficulty",
            "status",
            "tags",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "slug", "created_at", "updated_at")
        extra_kwargs = {
            "title": {"required": True},
            "description": {"required": True},
            "action_text": {"required": True},
            "image_preview": {"required": False, "allow_null": True},
            "difficulty": {"required": False},
            "status": {"required": False},
            "tags": {"required": False},
        }


class CourseStepCreateUpdateSerializer(
    CamelCaseSerializerMixin, serializers.ModelSerializer
):
    """Сериализатор для создания и обновления ступени курса (админ)."""

    class Meta:
        model = CourseStep
        fields = ("id", "course", "title", "order", "created_at", "updated_at")
        read_only_fields = ("id", "course", "created_at", "updated_at")


class CourseLessonCreateUpdateSerializer(
    CamelCaseSerializerMixin, serializers.ModelSerializer
):
    """Сериализатор для создания и обновления урока ступени (админ)."""

    article_id = serializers.PrimaryKeyRelatedField(
        source="article",
        queryset=Article.objects.all(),
        required=False,
        allow_null=True,
    )

    class Meta:
        model = CourseLesson
        fields = ("id", "step", "title", "order", "article_id", "created_at", "updated_at")
        read_only_fields = ("id", "step", "created_at", "updated_at")


class CourseTaskAnswerWriteSerializer(CamelCaseSerializerMixin, serializers.Serializer):
    """Write-сериализатор для варианта ответа при создании/обновлении задания."""

    text = serializers.CharField(max_length=255)
    is_correct = serializers.BooleanField(default=False)
    order = serializers.IntegerField(default=0)


class CourseTaskQuestionWriteSerializer(CamelCaseSerializerMixin, serializers.Serializer):
    """Write-сериализатор для вопроса при создании/обновлении задания."""

    text = serializers.CharField()
    order = serializers.IntegerField(default=0)
    answers = CourseTaskAnswerWriteSerializer(many=True)

    def validate_answers(self, value):
        if not value:
            raise serializers.ValidationError("Вопрос должен содержать хотя бы один вариант ответа.")
        correct_count = sum(1 for a in value if a.get("is_correct"))
        if correct_count != 1:
            raise serializers.ValidationError(
                "Каждый вопрос должен иметь ровно один правильный ответ."
            )
        return value


class CourseTaskCreateUpdateSerializer(CamelCaseSerializerMixin, serializers.ModelSerializer):
    """Write-сериализатор для создания и обновления задания с вложенными вопросами и ответами."""

    questions = CourseTaskQuestionWriteSerializer(many=True, required=False, default=list)

    class Meta:
        model = CourseTask
        fields = ("id", "title", "description", "order", "is_published", "questions")
        read_only_fields = ("id",)
        extra_kwargs = {
            "title": {"required": True},
            "description": {"required": False, "allow_blank": True, "allow_null": True},
            "order": {"required": False, "default": 0},
            "is_published": {"required": False},
        }

    def _rebuild_questions(self, task, questions_data):
        """Атомарно пересобирает дерево вопросов и ответов задания."""
        from django.db import transaction
        with transaction.atomic():
            task.questions.all().delete()
            for q_data in questions_data:
                answers_data = q_data.pop("answers", [])
                question = CourseTaskQuestion.objects.create(task=task, **q_data)
                for a_data in answers_data:
                    CourseTaskAnswer.objects.create(question=question, **a_data)

    def create(self, validated_data):
        questions_data = validated_data.pop("questions", [])
        task = CourseTask.objects.create(**validated_data)
        if questions_data:
            self._rebuild_questions(task, questions_data)
        return task

    def update(self, instance, validated_data):
        questions_data = validated_data.pop("questions", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if questions_data is not None:
            self._rebuild_questions(instance, questions_data)
        return instance


class UserTaskAttemptReadSerializer(CamelCaseSerializerMixin, serializers.ModelSerializer):
    """Сериализатор для чтения попытки ответа пользователя."""

    is_correct = serializers.SerializerMethodField()

    class Meta:
        model = UserTaskAttempt
        fields = ("id", "question_id", "selected_answer_id", "is_correct", "created_at")
        read_only_fields = fields

    def get_is_correct(self, obj: UserTaskAttempt) -> bool:
        return bool(obj.selected_answer.is_correct)


class UserTaskAttemptCreateSerializer(CamelCaseSerializerMixin, serializers.ModelSerializer):
    """Сериализатор для отправки ответа на вопрос задания."""

    question_id = serializers.PrimaryKeyRelatedField(
        source="question",
        queryset=CourseTaskQuestion.objects.all(),
    )
    answer_id = serializers.PrimaryKeyRelatedField(
        source="selected_answer",
        queryset=CourseTaskAnswer.objects.all(),
    )

    class Meta:
        model = UserTaskAttempt
        fields = ("question_id", "answer_id")

    def validate(self, data):
        question = data["question"]
        answer = data["selected_answer"]
        if answer.question_id != question.id:
            raise serializers.ValidationError(
                {"answer_id": "Вариант ответа не принадлежит указанному вопросу."}
            )
        return data


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


class CourseEnrollmentCreateSerializer(
  CamelCaseSerializerMixin,
  serializers.ModelSerializer,
):
  """
  Сериализатор для создания/регистрации пользователя на курс по идентификатору курса.

  Ожидает от фронта поле courseId (camelCase), которое преобразуется в course_id
  и маппится на поле course модели.
  """

  course_id = serializers.PrimaryKeyRelatedField(
    source="course",
    queryset=Course.objects.all(),
  )

  class Meta:
    model = CourseEnrollment
    fields = ("id", "course_id")
    read_only_fields = ("id",)

  def create(self, validated_data):
    user = self.context["request"].user
    course = validated_data["course"]

    enrollment, _created = CourseEnrollment.objects.get_or_create(
      user=user,
      course=course,
      defaults={
        "status": "enrolled",
        "started_at": timezone.now(),
      },
    )

    return enrollment

