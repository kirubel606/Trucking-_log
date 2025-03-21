from rest_framework import serializers
from .models import Trip, LogEntry

class TripSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trip
        fields = '__all__'
    def validate_truck_number(self, value):
        # When updating, ignore the current instance
        if self.instance:
            if Trip.objects.exclude(id=self.instance.id).filter(truck_number=value).exists():
                raise serializers.ValidationError("A trip with this truck number already exists.")
        else:
            if Trip.objects.filter(truck_number=value).exists():
                raise serializers.ValidationError("A trip with this truck number already exists.")
        return value

    def validate(self, data):
        """
        Ensure that the pickup and dropoff locations are valid and the geocoding process works correctly.
        """
        current_location = data.get('current_location')
        pickup_location = data.get('pickup_location')
        dropoff_location = data.get('dropoff_location')

        # Ensure that pickup and dropoff locations are provided
        if not pickup_location:
            raise serializers.ValidationError("Pickup location is required.")
        if not dropoff_location:
            raise serializers.ValidationError("Dropoff location is required.")
        if not current_location:
            raise serializers.ValidationError("Current location is required.")

        # Geocode addresses and validate the result
        current_lat, current_lng = self.context['view'].geocode_address(current_location)
        pickup_lat, pickup_lng = self.context['view'].geocode_address(pickup_location)
        dropoff_lat, dropoff_lng = self.context['view'].geocode_address(dropoff_location)

        if not all([pickup_lat, pickup_lng, dropoff_lat, dropoff_lng]):
            raise serializers.ValidationError("One or more locations could not be geocoded. Please check the addresses.")

        # Add the generated coordinates to the data (backend logic)
        data['current_lat'] = current_lat
        data['current_lng'] = current_lng
        data['pickup_lat'] = pickup_lat
        data['pickup_lng'] = pickup_lng
        data['dropoff_lat'] = dropoff_lat
        data['dropoff_lng'] = dropoff_lng

        return data

class LogEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = LogEntry
        fields = '__all__'
