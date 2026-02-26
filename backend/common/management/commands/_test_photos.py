"""
Общая логика для тестовых фотографий из backend/test-photos/.
Соответствие имён файлов породам: korgi_*, sharpei*, sibainu_*, spitz_*.
"""
from pathlib import Path

from django.conf import settings

BREED_PHOTO_PREFIXES = {
    "spitz": "Шпиц",
    "korgi": "Корги",
    "sibainu": "Сиба ину",
    "sharpei": "Шарпей",
}

PHOTO_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}


def get_test_photos_dir() -> Path:
    """Путь к каталогу backend/test-photos/."""
    return Path(settings.BASE_DIR) / "test-photos"


def get_all_photo_paths() -> list[Path]:
    """
    Возвращает список путей ко всем файлам-картинкам в test-photos
    (любые расширения из PHOTO_EXTENSIONS). Для назначения статей без привязки к породе.
    """
    photos_dir = get_test_photos_dir()
    if not photos_dir.is_dir():
        return []
    paths = [
        p
        for p in photos_dir.iterdir()
        if p.is_file() and p.suffix.lower() in PHOTO_EXTENSIONS
    ]
    paths.sort(key=lambda p: p.name)
    return paths


def get_photos_by_breed() -> dict[str, list[Path]]:
    """
    Сканирует test-photos и возвращает словарь: короткое имя породы -> список путей к файлам.
    Имена файлов должны начинаться с одного из префиксов (korgi, sharpei, sibainu, spitz).
    """
    photos_dir = get_test_photos_dir()
    if not photos_dir.is_dir():
        return {breed: [] for breed in BREED_PHOTO_PREFIXES.values()}

    result: dict[str, list[Path]] = {breed: [] for breed in BREED_PHOTO_PREFIXES.values()}

    for path in photos_dir.iterdir():
        if not path.is_file():
            continue
        if path.suffix.lower() not in PHOTO_EXTENSIONS:
            continue
        name_lower = path.name.lower()
        for prefix, breed_name in BREED_PHOTO_PREFIXES.items():
            if name_lower.startswith(prefix):
                result[breed_name].append(path)
                break

    for breed_name in result:
        result[breed_name].sort(key=lambda p: p.name)

    return result


def assign_photo_from_path(instance, field_name: str, file_path: Path, save_name: str) -> bool:
    """
    Сохраняет файл с диска в ImageField модели.
    instance — объект модели, field_name — имя поля ImageField,
    file_path — путь к файлу, save_name — имя при сохранении в storage.
    Возвращает True при успехе.
    """
    from django.core.files.images import ImageFile

    field = getattr(instance, field_name)
    try:
        with open(file_path, "rb") as f:
            field.save(save_name, ImageFile(f), save=True)
        return True
    except OSError:
        return False
