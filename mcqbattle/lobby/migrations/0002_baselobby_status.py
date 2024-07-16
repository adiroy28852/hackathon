# Generated by Django 5.0.6 on 2024-07-13 11:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('lobby', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='baselobby',
            name='status',
            field=models.CharField(choices=[('waiting', 'Waiting'), ('open', 'Open'), ('session_full', 'Session Full')], default='waiting', max_length=20),
        ),
    ]
