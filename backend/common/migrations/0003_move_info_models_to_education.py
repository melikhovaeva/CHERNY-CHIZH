from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("common", "0002_initial"),
        ("education", "0001_initial"),
    ]

    operations = [
        migrations.SeparateDatabaseAndState(
            database_operations=[],
            state_operations=[
                migrations.DeleteModel(name="CourseEnrollment"),
                migrations.DeleteModel(name="CourseTaskAnswer"),
                migrations.DeleteModel(name="CourseTaskQuestion"),
                migrations.DeleteModel(name="CourseTask"),
                migrations.DeleteModel(name="CourseLesson"),
                migrations.DeleteModel(name="CourseStep"),
                migrations.DeleteModel(name="Course"),
                migrations.DeleteModel(name="Article"),
                migrations.DeleteModel(name="InfoStatus"),
                migrations.DeleteModel(name="InfoTag"),
            ],
        ),
    ]

