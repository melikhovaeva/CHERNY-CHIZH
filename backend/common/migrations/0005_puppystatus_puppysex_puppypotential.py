# Generated manually for refactoring status/sex/potential to FK tables

import django.db.models.deletion
from django.db import migrations, models


def create_lookup_tables(apps, schema_editor):
    PuppyStatus = apps.get_model("common", "PuppyStatus")
    PuppySex = apps.get_model("common", "PuppySex")
    PuppyPotential = apps.get_model("common", "PuppyPotential")

    for code, label in [("for_sale", "В продаже"), ("reserved", "Забронирован"), ("sold", "Куплен")]:
        PuppyStatus.objects.get_or_create(code=code, defaults={"label": label})
    for code, label in [("male", "Мальчик"), ("female", "Девочка")]:
        PuppySex.objects.get_or_create(code=code, defaults={"label": label})
    for code, label in [("pet", "Домашний питомец"), ("breed", "Разведение"), ("show", "Шоу")]:
        PuppyPotential.objects.get_or_create(code=code, defaults={"label": label})


def fill_puppy_refs(apps, schema_editor):
    Puppy = apps.get_model("common", "Puppy")
    PuppyStatus = apps.get_model("common", "PuppyStatus")
    PuppySex = apps.get_model("common", "PuppySex")
    PuppyPotential = apps.get_model("common", "PuppyPotential")

    for p in Puppy.objects.all():
        if p.status and not p.status_ref_id:
            st = PuppyStatus.objects.filter(code=p.status).first()
            if st:
                p.status_ref = st
                p.save(update_fields=["status_ref"])
        if p.sex and not p.sex_ref_id:
            sx = PuppySex.objects.filter(code=p.sex).first()
            if sx:
                p.sex_ref = sx
                p.save(update_fields=["sex_ref"])
        if p.potential and not p.potential_ref_id:
            pt = PuppyPotential.objects.filter(code=p.potential).first()
            if pt:
                p.potential_ref = pt
                p.save(update_fields=["potential_ref"])


def noop_reverse(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ("common", "0004_alter_puppy_description"),
    ]

    operations = [
        migrations.CreateModel(
            name="PuppyStatus",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("code", models.CharField(max_length=64, unique=True)),
                ("label", models.CharField(max_length=255)),
            ],
            options={
                "verbose_name": "Статус щенка",
                "verbose_name_plural": "Статусы щенков",
            },
        ),
        migrations.CreateModel(
            name="PuppySex",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("code", models.CharField(max_length=64, unique=True)),
                ("label", models.CharField(max_length=255)),
            ],
            options={
                "verbose_name": "Пол щенка",
                "verbose_name_plural": "Пол щенков",
            },
        ),
        migrations.CreateModel(
            name="PuppyPotential",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("code", models.CharField(max_length=64, unique=True)),
                ("label", models.CharField(max_length=255)),
            ],
            options={
                "verbose_name": "Потенциал щенка",
                "verbose_name_plural": "Потенциалы щенков",
            },
        ),
        migrations.AlterField(
            model_name="puppy",
            name="status",
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name="puppy",
            name="sex",
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name="puppy",
            name="potential",
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name="puppy",
            name="status_ref",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.PROTECT,
                related_name="puppies",
                to="common.puppystatus",
            ),
        ),
        migrations.AddField(
            model_name="puppy",
            name="sex_ref",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.PROTECT,
                related_name="puppies",
                to="common.puppysex",
            ),
        ),
        migrations.AddField(
            model_name="puppy",
            name="potential_ref",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.PROTECT,
                related_name="puppies",
                to="common.puppypotential",
            ),
        ),
        migrations.RunPython(create_lookup_tables, noop_reverse),
        migrations.RunPython(fill_puppy_refs, noop_reverse),
    ]
