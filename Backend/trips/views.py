import requests
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status, viewsets
from .models import Trip, LogEntry
from .serializers import TripSerializer, LogEntrySerializer

class TripViewSet(viewsets.ModelViewSet):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer

    def geocode_address(self, address):
        """
        Uses OpenStreetMap's Nominatim API to convert an address to (lat, lon).
        """
        url = "https://nominatim.openstreetmap.org/search"
        params = {
            'q': address,
            'format': 'json',
            'limit': 1  # Only get the top result
        }
        headers = {
            'User-Agent': 'TruckingLogbook/1.0 (supreme.leader@example.com)'  # Replace with your info
        }
        response = requests.get(url, params=params, headers=headers)
        if response.status_code != 200:
            return None, None

        try:
            data = response.json()
        except ValueError:
            # JSON decoding failed
            return None, None

        if data:
            return float(data[0]['lat']), float(data[0]['lon'])
        return None, None

    def perform_create(self, serializer):
        """
        Geocode the addresses before creating a new Trip.
        """
        current_location = self.request.data.get('current_location')
        pickup_location = self.request.data.get('pickup_location')
        dropoff_location = self.request.data.get('dropoff_location')

        # Geocode addresses
        current_lat, current_lng = self.geocode_address(current_location)
        pickup_lat, pickup_lng = self.geocode_address(pickup_location)
        dropoff_lat, dropoff_lng = self.geocode_address(dropoff_location)

        # Handle geocoding failures
        if not (current_lat and pickup_lat and dropoff_lat):
            raise ValueError("One or more addresses could not be geocoded.")

        # Add geocoded data before saving
        serializer.save(
            current_lat=current_lat, current_lng=current_lng,
            pickup_lat=pickup_lat, pickup_lng=pickup_lng,
            dropoff_lat=dropoff_lat, dropoff_lng=dropoff_lng
        )

    def perform_update(self, serializer):
        """
        Geocode the addresses before updating the Trip.
        """
        current_location = self.request.data.get('current_location')
        pickup_location = self.request.data.get('pickup_location')
        dropoff_location = self.request.data.get('dropoff_location')

        # Geocode addresses if any location field is provided
        if current_location:
            current_lat, current_lng = self.geocode_address(current_location)
            if current_lat and current_lng:
                serializer.validated_data['current_lat'] = current_lat
                serializer.validated_data['current_lng'] = current_lng

        if pickup_location:
            pickup_lat, pickup_lng = self.geocode_address(pickup_location)
            if pickup_lat and pickup_lng:
                serializer.validated_data['pickup_lat'] = pickup_lat
                serializer.validated_data['pickup_lng'] = pickup_lng

        if dropoff_location:
            dropoff_lat, dropoff_lng = self.geocode_address(dropoff_location)
            if dropoff_lat and dropoff_lng:
                serializer.validated_data['dropoff_lat'] = dropoff_lat
                serializer.validated_data['dropoff_lng'] = dropoff_lng

        # Save the updated Trip with geocoded data
        serializer.save()

    @action(detail=False, methods=['post'])
    def submit_trip(self, request):
        """
        Handles trip creation with geocoding for addresses.
        """
        current_location = request.data.get('current_location')
        pickup_location = request.data.get('pickup_location')
        dropoff_location = request.data.get('dropoff_location')
        current_cycle_used = request.data.get('cycle_hours')

        # Ensure that all addresses are provided
        if not current_location or not pickup_location or not dropoff_location:
            return Response(
                {"error": "All location fields (current, pickup, dropoff) are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Geocode addresses
        current_lat, current_lng = self.geocode_address(current_location)
        pickup_lat, pickup_lng = self.geocode_address(pickup_location)
        dropoff_lat, dropoff_lng = self.geocode_address(dropoff_location)

        # Handle geocoding failures
        if not (current_lat and pickup_lat and dropoff_lat):
            return Response(
                {"error": "One or more addresses could not be geocoded."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create a new Trip entry in the database with the geocoded data
        trip_data = {
            'truck_number': request.data.get('truck_number'),
            'driver_initials': request.data.get('driver_initials'),
            'co_driver': request.data.get('co_driver'),
            'carrier_name': request.data.get('carrier_name'),
            'office_address': request.data.get('office_address'),
            'current_location': current_location,
            'pickup_location': pickup_location,
            'dropoff_location': dropoff_location,
            'shipping_doc_number': request.data.get('shipping_doc_number'),
            'date': request.data.get('date'),
            'total_miles': request.data.get('total_miles'),
            'cycle_hours': current_cycle_used,
            'current_lat': current_lat,
            'current_lng': current_lng,
            'pickup_lat': pickup_lat,
            'pickup_lng': pickup_lng,
            'dropoff_lat': dropoff_lat,
            'dropoff_lng': dropoff_lng,
        }
        
        trip = Trip.objects.create(**trip_data)
        serializer = TripSerializer(trip)

        return Response(serializer.data, status=status.HTTP_201_CREATED)
        
class LogEntryViewSet(viewsets.ModelViewSet):
    queryset = LogEntry.objects.all()
    serializer_class = LogEntrySerializer

    def geocode_address(self, address):
        """
        Uses OpenStreetMap's Nominatim API to convert an address to (lat, lon).
        """
        url = "https://nominatim.openstreetmap.org/search"
        params = {
            'q': address,
            'format': 'json',
            'limit': 1  # Only get the top result
        }
        headers = {
            'User-Agent': 'TruckingLogbook/1.0 (supreme.leader@example.com)'  # Replace with your info
        }
        response = requests.get(url, params=params, headers=headers)
        if response.status_code != 200:
            return None, None

        try:
            data = response.json()
        except ValueError:
            # JSON decoding failed
            return None, None

        if data:
            return float(data[0]['lat']), float(data[0]['lon'])
        return None, None

    def perform_create(self, serializer):
        """
        Override perform_create to geocode the address before saving the LogEntry.
        """
        location = self.request.data.get('location')
        if location:
            lat, lng = self.geocode_address(location)
            if lat and lng:
                # Add latitude and longitude to the data before saving
                serializer.save(latitude=lat, longitude=lng)
            else:
                # If geocoding fails, return a bad request response
                raise ValueError("Could not geocode the provided location.")
        else:
            # If no location is provided, just save without geocoding
            serializer.save()

    def perform_update(self, serializer):
        """
        Override perform_update to geocode the address before updating the LogEntry.
        """
        location = self.request.data.get('location')
        if location:
            lat, lng = self.geocode_address(location)
            if lat and lng:
                # Add latitude and longitude to the data before saving
                serializer.save(latitude=lat, longitude=lng)
            else:
                # If geocoding fails, return a bad request response
                raise ValueError("Could not geocode the provided location.")
        else:
            # If no location is provided, just save without geocoding
            serializer.save()