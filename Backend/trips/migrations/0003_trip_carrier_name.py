# Generated by Django 5.1.7 on 2025-03-22 19:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("trips", "0002_alter_logentry_status"),
    ]

    operations = [
        migrations.AddField(
            model_name="trip",
            name="carrier_name",
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
