import React, { useEffect, useState, useCallback } from "react";
import { GoogleMap, LoadScript, DirectionsRenderer, Marker, InfoWindow } from "@react-google-maps/api";

const RouteMap = ({ routeData, trip_id }) => {
  const { pickup_lat, pickup_lng, dropoff_lat, dropoff_lng } = routeData;
  const GOOGLE_API = import.meta.env.VITE_GOOGLE_API;
  const Base_URL = import.meta.env.VITE_BACKEND_URL;

  const [directions, setDirections] = useState(null);
  const [logEntries, setLogEntries] = useState([]);
  const [activeMarker, setActiveMarker] = useState(null);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const onLoad = useCallback(() => {
    console.log("Google Maps API Loaded");
    setIsGoogleLoaded(true);
  }, []);

  const onError = useCallback(() => {
    console.error("Failed to load Google Maps API.");
  }, []);

  // Fetch log entries for the trip
  useEffect(() => {
    const fetchLogEntries = async () => {
      try {
        const response = await fetch(`${Base_URL}api/logs/?trip_id=${trip_id}`);
        const data = await response.json();
        console.log("Fetched Log Entries:", data);
        setLogEntries(data);
      } catch (error) {
        console.error("Error fetching log entries:", error);
      }
    };

    if (trip_id) fetchLogEntries();
  }, [trip_id]);

  // Fetch directions after Google Maps API loads
  useEffect(() => {
    if (
      isGoogleLoaded &&
      pickup_lat &&
      pickup_lng &&
      dropoff_lat &&
      dropoff_lng &&
      window.google &&
      window.google.maps
    ) {
      console.log("Google Maps API is ready. Fetching directions...");
      const directionsService = new window.google.maps.DirectionsService();
      const origin = { lat: parseFloat(pickup_lat), lng: parseFloat(pickup_lng) };
      const destination = { lat: parseFloat(dropoff_lat), lng: parseFloat(dropoff_lng) };

      const request = { origin, destination, travelMode: window.google.maps.TravelMode.DRIVING };

      directionsService.route(request, (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          console.log("Directions received:", result);
          setDirections(result);
        } else {
          console.error("Directions request failed:", status);
        }
      });
    }
  }, [isGoogleLoaded, pickup_lat, pickup_lng, dropoff_lat, dropoff_lng]);

  return (
    <LoadScript googleMapsApiKey={GOOGLE_API} onLoad={onLoad} onError={onError}>
      <GoogleMap
        id="route-map"
        mapContainerStyle={{ width: "100%", height: "500px" }}
        zoom={8}
        center={{ lat: parseFloat(pickup_lat) || 0, lng: parseFloat(pickup_lng) || 0 }}
      >
        {directions && <DirectionsRenderer directions={directions} />}

        {/* Log markers */}
        {logEntries.map((entry, index) => {
          const lat = parseFloat(entry.latitude);
          const lng = parseFloat(entry.longitude);
          if (isNaN(lat) || isNaN(lng)) return null;

          return (
            <Marker
              key={index}
              position={{ lat, lng }}
              onMouseOver={() => setActiveMarker(index)}
              onMouseOut={() => setActiveMarker(null)}
            >
              {activeMarker === index && (
                <InfoWindow position={{ lat, lng }}>
                  <div>{entry.remarks}</div>
                </InfoWindow>
              )}
            </Marker>
          );
        })}
      </GoogleMap>
    </LoadScript>
  );
};

export default RouteMap;
