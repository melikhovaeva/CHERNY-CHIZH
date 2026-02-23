from typing import Dict, Any, Type

from django.db.models import Model

from common.models import AnimalStatus, AnimalSex, AnimalPotential
from common.serializers import CodeLabelSerializer


DictionaryConfig = Dict[str, Any]


def _make_animal_group() -> DictionaryConfig:
    """
    Конфигурация группы словарей для животных (щенки / собаки).
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
            "key": "animal",
            "name": "animal",
            "verbose_name": "Справочники, относящиеся к животным",
            "dictionaries": {
                "status": _entry(
                    pk=1,
                    name="status",
                    verbose_name="Статус",
                    model=AnimalStatus,
                    serializer=CodeLabelSerializer,
                ),
                "sex": _entry(
                    pk=2,
                    name="sex",
                    verbose_name="Пол",
                    model=AnimalSex,
                    serializer=CodeLabelSerializer,
                ),
                "potential": _entry(
                    pk=3,
                    name="potential",
                    verbose_name="Потенциал",
                    model=AnimalPotential,
                    serializer=CodeLabelSerializer,
                ),
            },
        }
    }


DICTIONARY_GROUPS: DictionaryConfig = _make_animal_group()
