# Generated manually for multiple photos per puppy

from django.db import migrations, models
import django.db.models.deletion


def copy_photos_to_puppy_photo(apps, schema_editor):
    Puppy = apps.get_model("common", "Puppy")
    PuppyPhoto = apps.get_model("common", "PuppyPhoto")
    for puppy in Puppy.objects.all():
        try:
            if puppy.photo and puppy.photo.name:
                PuppyPhoto.objects.create(
                    puppy=puppy,
                    photo=puppy.photo.name,
                    order=0,
                )
        except Exception:
            pass


def noop_reverse(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ("common", "0007_alter_breed_options_alter_puppy_options_puppy_photo"),
    ]

    operations = [
        migrations.CreateModel(
            name="PuppyPhoto",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("photo", models.ImageField(upload_to="puppies/")),
                ("order", models.PositiveSmallIntegerField(default=0)),
                (
                    "puppy",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="photos",
                        to="common.puppy",
                    ),
                ),
            ],
            options={
                "ordering": ["order", "id"],
                "verbose_name": "Фото щенка",
                "verbose_name_plural": "Фото щенков",
            },
        ),
        migrations.RunPython(copy_photos_to_puppy_photo, noop_reverse),
        migrations.RemoveField(
            model_name="puppy",
            name="photo",
        ),
    ]
