"""Константы приложения education."""

COURSE_IMAGE_UPLOAD_FIELD_NAME = "image"
COURSE_IMAGE_ALLOWED_CONTENT_TYPES = (
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
)
COURSE_IMAGE_MAX_SIZE_BYTES = 5 * 1024 * 1024  # 5 MB
