# Generated by Django 5.0.7 on 2024-07-20 16:39

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0003_activity_rename_name_absencebalance_description_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='holiday',
            old_name='begin',
            new_name='date',
        ),
    ]
