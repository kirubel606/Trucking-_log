# Generated by Django 5.1.7 on 2025-03-22 17:05

import datetime
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Trip",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "truck_number",
                    models.CharField(
                        blank=True, max_length=255, null=True, unique=True
                    ),
                ),
                (
                    "driver_initials",
                    models.CharField(blank=True, max_length=10, null=True),
                ),
                ("co_driver", models.CharField(blank=True, max_length=255, null=True)),
                ("current_location", models.CharField(max_length=255)),
                ("pickup_location", models.CharField(max_length=255)),
                ("dropoff_location", models.CharField(max_length=255)),
                (
                    "shipping_doc_number",
                    models.CharField(blank=True, max_length=255, null=True),
                ),
                ("date", models.DateField(default=datetime.date.today)),
                ("total_miles", models.IntegerField(blank=True, null=True)),
                ("cycle_hours", models.IntegerField(blank=True, null=True)),
                ("current_lat", models.FloatField(blank=True, null=True)),
                ("current_lng", models.FloatField(blank=True, null=True)),
                ("pickup_lat", models.FloatField(blank=True, null=True)),
                ("pickup_lng", models.FloatField(blank=True, null=True)),
                ("dropoff_lat", models.FloatField(blank=True, null=True)),
                ("dropoff_lng", models.FloatField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name="LogEntry",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("timestamp", models.DateTimeField(auto_now_add=True)),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("Driving", "Driving"),
                            ("Resting", "Resting"),
                            ("Fueling", "Fueling"),
                        ],
                        max_length=50,
                    ),
                ),
                ("location", models.CharField(max_length=255)),
                ("remarks", models.TextField(blank=True, null=True)),
                (
                    "trip",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="logs",
                        to="trips.trip",
                    ),
                ),
            ],
        ),
    ]
