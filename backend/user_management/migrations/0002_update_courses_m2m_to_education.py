from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("education", "0001_initial"),
        ("user_management", "0001_initial"),
    ]

    operations = [
        migrations.SeparateDatabaseAndState(
            database_operations=[],
            state_operations=[
                migrations.AlterField(
                    model_name="useraccount",
                    name="courses",
                    field=models.ManyToManyField(
                        blank=True,
                        related_name="users",
                        through="education.CourseEnrollment",
                        to="education.course",
                    ),
                ),
            ],
        ),
    ]

