# Replace legacy CharField status/sex/potential with FK (rename _ref -> status/sex/potential)

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("common", "0005_puppystatus_puppysex_puppypotential"),
    ]

    operations = [
        migrations.RemoveField(model_name="puppy", name="status"),
        migrations.RemoveField(model_name="puppy", name="sex"),
        migrations.RemoveField(model_name="puppy", name="potential"),
        migrations.RenameField(model_name="puppy", old_name="status_ref", new_name="status"),
        migrations.RenameField(model_name="puppy", old_name="sex_ref", new_name="sex"),
        migrations.RenameField(model_name="puppy", old_name="potential_ref", new_name="potential"),
        migrations.AlterField(
            model_name="puppy",
            name="status",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.PROTECT,
                related_name="puppies",
                to="common.puppystatus",
            ),
        ),
        migrations.AlterField(
            model_name="puppy",
            name="sex",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.PROTECT,
                related_name="puppies",
                to="common.puppysex",
            ),
        ),
        migrations.AlterField(
            model_name="puppy",
            name="potential",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.PROTECT,
                related_name="puppies",
                to="common.puppypotential",
            ),
        ),
    ]
