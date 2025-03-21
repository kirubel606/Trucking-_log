// src/components/TripPage.jsx
import { useState } from "react";
import TripForm from "./TripForm";
import RouteMap from "./RouteMap";
import LogSheet from "./LogSheet";

const TripPage = () => {
  const [routeData, setRouteData] = useState(null);
  const [tripData, setTripData] = useState(null);

  const handleSubmit = (tripResponse) => {
    // The tripResponse should contain the geocoded coordinates from your backend.
    setRouteData(tripResponse);
    setTripData(tripResponse); // You might need to modify this depending on how the data is structured.
  };

  return (
    <div className="p-4">
      <h1>Trip Planning</h1>
      <TripForm onSubmit={handleSubmit} />
      {routeData && <RouteMap routeData={routeData} />}
      {tripData && <LogSheet tripData={tripData} />}
    </div>
  );
};

export default TripPage;
