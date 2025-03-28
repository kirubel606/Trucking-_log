# Generated by Django 5.1.7 on 2025-03-22 22:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("trips", "0004_trip_office_address"),
    ]

    operations = [
        migrations.AddField(
            model_name="logentry",
            name="latitude",
            field=models.DecimalField(decimal_places=6, max_digits=9, null=True),
        ),
        migrations.AddField(
            model_name="logentry",
            name="longitude",
            field=models.DecimalField(decimal_places=6, max_digits=9, null=True),
        ),
    ]
