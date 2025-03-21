// src/pages/ViewRoute.jsx
import { useState, useEffect } from "react";
import RouteMap from "../components/RouteMap"; // Assuming this is the correct path

const ViewRoute = () => {
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);

  // Fetch trips from the backend
  useEffect(() => {
    const fetchTrips = async () => {
      const response = await fetch("http://localhost:8000/api/trips/");
      const data = await response.json();
      setTrips(data);
    };
    fetchTrips();
  }, []);

  // Handle the trip selection from the dropdown
  const handleSelectChange = (e) => {
    const selectedTripId = parseInt(e.target.value, 10); // Convert to number
    const trip = trips.find((trip) => trip.id === selectedTripId);
    setSelectedTrip(trip);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Select a Trip to View Route</h2>
      <select
        onChange={handleSelectChange}
        className="p-2 border rounded mb-4"
        value={selectedTrip ? selectedTrip.id : ""}
      >
        <option value="">Select a trip</option>
        {trips.map((trip) => (
          <option key={trip.id} value={trip.id}>
            {trip.pickup_location} ➝ {trip.dropoff_location},{trip.truckNumber} - {trip.date}
          </option>
        ))}
      </select>

      {selectedTrip && <RouteMap routeData={selectedTrip} />}
    </div>
  );
};

export default ViewRoute;
