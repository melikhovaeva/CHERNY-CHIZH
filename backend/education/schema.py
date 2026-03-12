"""
OpenAPI (drf-spectacular) схема для приложения education.
Описания эндпоинтов и типы для сериализаторов.
"""
from drf_spectacular.utils import extend_schema, extend_schema_view, extend_schema_field

__all__ = [
    "extend_schema",
    "extend_schema_view",
    "extend_schema_field",
    "article_view_schema",
    "course_view_schema",
    "education_article_view_schema",
    "education_course_view_schema",
    "education_tag_view_schema",
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

# --- Education*ViewSet (префикс /education) ---
education_article_view_schema = {
    "list": extend_schema(
        summary="Список статей (education)",
        description="Возвращает список статей с краткой информацией (education-префикс).",
        tags=["Education"],
    ),
    "retrieve": extend_schema(
        summary="Детали статьи (education)",
        description="Возвращает полное содержимое одной статьи (education-префикс).",
        tags=["Education"],
    ),
    "home_library": extend_schema(
        summary="Блок «База знаний» для главной (education)",
        description=(
            "Теги с не менее чем 3 статьями (макс. 4 тега), для каждого — минимум 3 статьи. "
            "Только опубликованные статьи. (education-префикс)"
        ),
        tags=["Education"],
    ),
}

education_course_view_schema = {
    "list": extend_schema(
        summary="Список курсов (education)",
        description="Возвращает список доступных курсов (education-префикс).",
        tags=["Education"],
    ),
    "retrieve": extend_schema(
        summary="Детали курса (education)",
        description="Возвращает полную структуру курса со ступенями, уроками и заданиями (education-префикс).",
        tags=["Education"],
    ),
}


education_tag_view_schema = {
    "list": extend_schema(
        summary="Список тегов (education)",
        description=(
            "Возвращает список возможных тегов для статей и курсов. "
        ),
        tags=["Education"],
    ),
    "create": extend_schema(
        summary="Массовое добавление тегов (education)",
        description=(
            "Принимает массив объектов тегов и создаёт их в системе. "
            "Подходит для пополнения списка возможных тегов."
        ),
        tags=["Education"],
    ),
}
