import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript, DirectionsRenderer, Marker, InfoWindow } from "@react-google-maps/api";

const RouteMap = ({ routeData, trip_id }) => {
  const { pickup_lat, pickup_lng, dropoff_lat, dropoff_lng } = routeData;

  const [directions, setDirections] = useState(null);
  const [googleLoaded, setGoogleLoaded] = useState(false); // Track if Google Maps API is loaded
  const [loadingError, setLoadingError] = useState(null); // Track if there's an error loading the map
  const [logEntries, setLogEntries] = useState([]); // Track log entries for the trip
  const [activeMarker, setActiveMarker] = useState(null); // Track which marker is active for showing info

  const onLoad = () => {
    setGoogleLoaded(true); // Google Maps is loaded
  };

  const onError = () => {
    setLoadingError("Failed to load Google Maps API.");
  };

  // Fetch log entries for the trip
  useEffect(() => {
    const fetchLogEntries = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/logs/?trip_id=${trip_id}`);
        const data = await response.json();
        setLogEntries(data); // Set log entries state
      } catch (error) {
        console.error("Error fetching log entries:", error);
      }
    };

    if (trip_id) {
      fetchLogEntries();
    }
  }, [trip_id]);

  // Fetch directions when map is ready
  useEffect(() => {
    if (googleLoaded && pickup_lat && pickup_lng && dropoff_lat && dropoff_lng && window.google) {
      const directionsService = new window.google.maps.DirectionsService();

      const origin = { lat: parseFloat(pickup_lat), lng: parseFloat(pickup_lng) };
      const destination = { lat: parseFloat(dropoff_lat), lng: parseFloat(dropoff_lng) };
      const request = {
        origin: origin,
        destination: destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      };

      directionsService.route(request, (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
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

  // Only compute markers if Google Maps API is loaded
  const markers = googleLoaded && window.google
    ? logEntries.map((entry, index) => {
        const { latitude, longitude, status, remarks } = entry;
        const lat = latitude;
        const lng = longitude;
        let color;

        // Set color based on status
        switch (status) {
          case 'Driving':
            color = 'blue';
            break;
          case 'Resting':
            color = 'green';
            break;
          case 'Fueling':
            color = 'orange';
            break;
          case 'On Duty (Not Driving)':
            color = 'yellow';
            break;
          case 'Off Duty':
            color = 'red';
            break;
          case 'Sleeper Berth':
            color = 'purple';
            break;
          default:
            color = 'gray';
        }

        console.log(`Marker for ${status} at:`, lat, lng); // Log each marker

        return (
          <Marker
            key={index}
            position={{ lat, lng }}
            icon={{
              path: window.google.maps.SymbolPath.CIRCLE,
              fillColor: color,
              fillOpacity: 1,
              scale: 10,
              strokeColor: 'white',
              strokeWeight: 2,
            }}
            onMouseOver={() => setActiveMarker(index)} // Set the active marker when mouse is over
            onMouseOut={() => setActiveMarker(null)} // Clear active marker when mouse leaves
          >
            {activeMarker === index && (
              <InfoWindow position={{ lat, lng }}>
                <div>{remarks}</div> {/* Display remarks on hover */}
              </InfoWindow>
            )}
          </Marker>
        );
      })
    : null;

  return (
    <LoadScript
      googleMapsApiKey="AIzaSyCCfjyxj72qr_Q48fZpBLQ0EL4uRk3QYeg"
      onLoad={onLoad}
      onError={onError}
    >
      <div style={{ marginBottom: "10px" }}>
        <strong>Legend:</strong>
        <ul>
          <li><span style={{ color: 'blue' }}>●</span> Driving</li>
          <li><span style={{ color: 'green' }}>●</span> Resting</li>
          <li><span style={{ color: 'orange' }}>●</span> Fueling</li>
          <li><span style={{ color: 'yellow' }}>●</span> On Duty (Not Driving)</li>
          <li><span style={{ color: 'red' }}>●</span> Off Duty</li>
          <li><span style={{ color: 'purple' }}>●</span> Sleeper Berth</li>
        </ul>
      </div>
      <GoogleMap
        id="route-map"
        mapContainerStyle={{ width: "100%", height: "400px" }}
        zoom={8}
        center={{ lat: parseFloat(pickup_lat), lng: parseFloat(pickup_lng) }}
      >
        {directions && <DirectionsRenderer directions={directions} />}
        {markers}
      </GoogleMap>
    </LoadScript>
  );
};

export default RouteMap;
