from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user_management', '0004_remove_user_avatar_color_remove_user_avatar_initials'),
    ]

    operations = [
        migrations.CreateModel(
            name='RolePermission',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('codename', models.CharField(max_length=64, unique=True, verbose_name='Код')),
                ('description', models.CharField(max_length=255, verbose_name='Описание')),
            ],
            options={
                'verbose_name': 'Разрешение',
                'verbose_name_plural': 'Разрешения',
                'ordering': ['codename'],
            },
        ),
        migrations.AddField(
            model_name='role',
            name='permissions',
            field=models.ManyToManyField(
                blank=True,
                related_name='roles',
                to='user_management.rolepermission',
                verbose_name='Разрешения',
            ),
        ),
    ]
