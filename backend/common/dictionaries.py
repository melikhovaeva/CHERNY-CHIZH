from typing import Dict, Any

from common.models import DogPotential, DogSex, DogStatus


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
        choices,
    ) -> Dict[str, Any]:
        return {
            "id": pk,
            "name": name,
            "verbose_name": verbose_name,
            "choices": choices,
        }

    return {
        1: {
            "key": "puppy",
            "name": "puppy",
            "verbose_name": "Справочники, относящиеся к животным",
            "dictionaries": {
                "status": _entry(
                    pk=1,
                    name="status",
                    verbose_name="Статус",
                    choices=DogStatus.choices,
                ),
                "sex": _entry(
                    pk=2,
                    name="sex",
                    verbose_name="Пол",
                    choices=DogSex.choices,
                ),
                "potential": _entry(
                    pk=3,
                    name="potential",
                    verbose_name="Потенциал",
                    choices=DogPotential.choices,
                ),
            },
        }
    }


DICTIONARY_GROUPS: DictionaryConfig = _make_animal_group()
