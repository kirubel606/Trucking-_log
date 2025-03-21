import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript, DirectionsService, DirectionsRenderer } from "@react-google-maps/api";

const RouteMap = ({ routeData }) => {
  const { pickup_lat, pickup_lng, dropoff_lat, dropoff_lng } = routeData;

  const [directions, setDirections] = useState(null);
  const [googleLoaded, setGoogleLoaded] = useState(false); // Track if Google Maps API is loaded
  const [loadingError, setLoadingError] = useState(null); // Track if there's an error loading the map

  const onLoad = () => {
    setGoogleLoaded(true); // Google Maps is loaded
  };

  const onError = () => {
    setLoadingError("Failed to load Google Maps API.");
  };

  useEffect(() => {
    if (googleLoaded && pickup_lat && pickup_lng && dropoff_lat && dropoff_lng) {
      const directionsService = new google.maps.DirectionsService();

      const origin = { lat: pickup_lat, lng: pickup_lng };
      const destination = { lat: dropoff_lat, lng: dropoff_lng };
      const request = {
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING,
      };

      directionsService.route(request, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          console.error("Directions request failed due to " + status);
          setLoadingError("Failed to fetch directions.");
        }
      });
    }
  }, [googleLoaded, pickup_lat, pickup_lng, dropoff_lat, dropoff_lng]);

  if (loadingError) {
    return <div>{loadingError}</div>;
  }

  return (
    <LoadScript
      googleMapsApiKey="AIzaSyCCfjyxj72qr_Q48fZpBLQ0EL4uRk3QYeg"
      onLoad={onLoad} // Trigger onLoad when the script is successfully loaded
      onError={onError} // Trigger onError if the script fails to load
    >
      <GoogleMap
        id="route-map"
        mapContainerStyle={{ width: "100%", height: "400px" }}
        zoom={8}
        center={{ lat: pickup_lat, lng: pickup_lng }} // Initial center before directions load
      >
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
    </LoadScript>
  );
};

export default RouteMap;
