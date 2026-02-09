# Generated manually

from django.db import migrations


def fill_lookup_tables(apps, schema_editor):
    PuppyStatus = apps.get_model("common", "PuppyStatus")
    PuppySex = apps.get_model("common", "PuppySex")
    PuppyPotential = apps.get_model("common", "PuppyPotential")

    for code, label in [
        ("for_sale", "В продаже"),
        ("reserved", "Забронирован"),
        ("sold", "Куплен"),
    ]:
        PuppyStatus.objects.get_or_create(code=code, defaults={"label": label})

    for code, label in [
        ("male", "Мальчик"),
        ("female", "Девочка"),
    ]:
        PuppySex.objects.get_or_create(code=code, defaults={"label": label})

    for code, label in [
        ("pet", "Домашний питомец"),
        ("breed", "Разведение"),
        ("show", "Шоу"),
    ]:
        PuppyPotential.objects.get_or_create(code=code, defaults={"label": label})


def noop(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ("common", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(fill_lookup_tables, noop),
    ]
