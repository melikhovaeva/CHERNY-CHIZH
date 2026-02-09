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
            "name": "puppy-dictionary",
            "verbose_name": "Справочники, относящиеся к щенкам",
            "dictionaries": {
                "status": _entry(
                    pk=1,
                    name="puppy-status-dictionary",
                    verbose_name="Статусы щенков",
                    model=PuppyStatus,
                    serializer=PuppyStatusSerializer,
                ),
                "sex": _entry(
                    pk=2,
                    name="puppy-sex-dictionary",
                    verbose_name="Пол щенков",
                    model=PuppySex,
                    serializer=PuppySexSerializer,
                ),
                "potential": _entry(
                    pk=3,
                    name="puppy-potential-dictionary",
                    verbose_name="Потенциал щенков",
                    model=PuppyPotential,
                    serializer=PuppyPotentialSerializer,
                ),
            },
        }
    }


DICTIONARY_GROUPS: DictionaryConfig = _make_puppy_group()

