from typing import Dict, Any, Type

from django.db.models import Model

from common.models import PuppyStatus, PuppySex, PuppyPotential
from common.serializers import (
    PuppyStatusSerializer,
    PuppySexSerializer,
    PuppyPotentialSerializer,
)


DictionaryConfig = Dict[str, Any]


def _make_puppy_group() -> DictionaryConfig:
    """
    Конфигурация группы словарей для щенков
    """

    def _entry(
        *,
        pk: int,
        name: str,
        verbose_name: str,
        model: Type[Model],
        serializer,
    ) -> Dict[str, Any]:
        return {
            "id": pk,
            "name": name,
            "verbose_name": verbose_name,
            "model": model,
            "serializer": serializer,
        }

    return {
        1: {
            "key": "puppy",
            "name": "puppy",
            "verbose_name": "Справочники, относящиеся к щенкам",
            "dictionaries": {
                "status": _entry(
                    pk=1,
                    name="status",
                    verbose_name="Статус",
                    model=PuppyStatus,
                    serializer=PuppyStatusSerializer,
                ),
                "sex": _entry(
                    pk=2,
                    name="sex",
                    verbose_name="Пол",
                    model=PuppySex,
                    serializer=PuppySexSerializer,
                ),
                "potential": _entry(
                    pk=3,
                    name="potential",
                    verbose_name="Потенциал",
                    model=PuppyPotential,
                    serializer=PuppyPotentialSerializer,
                ),
            },
        }
    }


DICTIONARY_GROUPS: DictionaryConfig = _make_puppy_group()

