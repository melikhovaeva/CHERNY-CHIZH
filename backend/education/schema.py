"""
OpenAPI (drf-spectacular) схема для приложения education.
Описания эндпоинтов и типы для сериализаторов.
"""
from drf_spectacular.utils import extend_schema, extend_schema_view

from drf_spectacular.utils import extend_schema_field

__all__ = [
    "extend_schema",
    "extend_schema_view",
    "extend_schema_field",
    "article_view_schema",
    "course_view_schema",
]

# --- ArticleViewSet ---
article_view_schema = {
    "list": extend_schema(
        summary="Список статей",
        description="Возвращает список статей с краткой информацией.",
        tags=["Articles"],
    ),
    "retrieve": extend_schema(
        summary="Детали статьи",
        description="Возвращает полное содержимое одной статьи.",
        tags=["Articles"],
    ),
    "home_library": extend_schema(
        summary="Блок «База знаний» для главной",
        description=(
            "Теги с не менее чем 3 статьями (макс. 4 тега), для каждого — минимум 3 статьи. "
            "Только опубликованные статьи."
        ),
        tags=["Articles"],
    ),
}

# --- CourseViewSet ---
course_view_schema = {
    "list": extend_schema(
        summary="Список курсов",
        description="Возвращает список доступных курсов.",
        tags=["Courses"],
    ),
    "retrieve": extend_schema(
        summary="Детали курса",
        description="Возвращает полную структуру курса со ступенями, уроками и заданиями.",
        tags=["Courses"],
    ),
}
