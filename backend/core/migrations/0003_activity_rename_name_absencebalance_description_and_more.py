# Generated by Django 5.0.7 on 2024-07-20 16:38

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
        ('core', '0002_holiday_project_absencebalance_timelog'),
    ]

    operations = [
        migrations.CreateModel(
            name='Activity',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('date_modified', models.DateTimeField(auto_now=True)),
                ('name', models.CharField()),
            ],
            options={
                'verbose_name_plural': 'Activities',
            },
        ),
        migrations.RenameField(
            model_name='absencebalance',
            old_name='name',
            new_name='description',
        ),
        migrations.AlterField(
            model_name='absencebalance',
            name='date',
            field=models.DateField(),
        ),
        migrations.AlterField(
            model_name='holiday',
            name='begin',
            field=models.DateField(),
        ),
        migrations.AlterField(
            model_name='timelog',
            name='end',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='timelog',
            name='project',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='time_logs', to='core.project'),
        ),
        migrations.AlterField(
            model_name='user',
            name='groups',
            field=models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups'),
        ),
        migrations.AlterField(
            model_name='user',
            name='user_permissions',
            field=models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions'),
        ),
        migrations.AlterField(
            model_name='timelog',
            name='activity',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='time_logs', to='core.activity'),
        ),
    ]
