# trips/models.py
from django.db import models
from datetime import date

class Trip(models.Model):
    truck_number = models.CharField(max_length=255, unique=True,null=True, blank=True)
    driver_initials = models.CharField(max_length=10,null=True, blank=True)
    co_driver = models.CharField(max_length=255, null=True, blank=True)
    carrier_name = models.CharField(max_length=255, null=True, blank=True)
    office_address = models.CharField(max_length=255, null=True, blank=True)

    # Current location of the truck
    current_location = models.CharField(max_length=255)  # Add this field
    pickup_location = models.CharField(max_length=255)
    dropoff_location = models.CharField(max_length=255)
    shipping_doc_number = models.CharField(max_length=255, null=True, blank=True)
    date = models.DateField(default=date.today) 
    total_miles = models.IntegerField(null=True, blank=True)
    cycle_hours = models.IntegerField(null=True,blank=True)  # Note: In the serializer, this will map to current_cycle_used

    # Coordinates fields for the locations
    current_lat = models.FloatField(null=True, blank=True)  # Add this field
    current_lng = models.FloatField(null=True, blank=True)  # Add this field
    pickup_lat = models.FloatField(null=True, blank=True)
    pickup_lng = models.FloatField(null=True, blank=True)
    dropoff_lat = models.FloatField(null=True, blank=True)
    dropoff_lng = models.FloatField(null=True, blank=True)

    def __str__(self):
        return f"Trip from {self.pickup_location} to {self.dropoff_location} on {self.date}"

    def update_coordinates(self, pickup_location=None, dropoff_location=None):
        """
        Update the coordinates of the pickup and dropoff locations by geocoding the addresses.
        """
        if pickup_location:
            self.pickup_lat, self.pickup_lng = self.geocode_address(pickup_location)
        if dropoff_location:
            self.dropoff_lat, self.dropoff_lng = self.geocode_address(dropoff_location)
        self.save()




class LogEntry(models.Model):
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name="logs")
    timestamp = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=50, 
        choices=[("Driving", "Driving"), ("Resting", "Resting"), ("Fueling", "Fueling"),("On Duty (Not Driving)","On Duty (Not Driving)"),("Off Duty","Off Duty"),("Sleeper Berth","Sleeper Berth")]
    )
    location = models.CharField(max_length=255)
    remarks = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"{self.status} at {self.location} on {self.timestamp}"

    def save(self, *args, **kwargs):
        # You can add custom save logic here if needed, such as updating related Trip data.
        super().save(*args, **kwargs)
