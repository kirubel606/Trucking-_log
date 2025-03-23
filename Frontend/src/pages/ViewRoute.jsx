// src/pages/ViewRoute.jsx
import { useState, useEffect } from "react";
import RouteMap from "../components/RouteMap"; // Assuming this is the correct path

const ViewRoute = ({ darkMode }) => {
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [TripID, setselectedtripid] = useState(null); // Keep this for the selected trip ID
  const Base_URL = import.meta.env.VITE_BACKEND_URL;

  // Fetch trips from the backend
  useEffect(() => {
    const fetchTrips = async () => {
      const response = await fetch(`${Base_URL}api/trips/`);
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
    setselectedtripid(selectedTripId); // Update the selected trip ID
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Select a Trip to View Route</h2>
      <select
        onChange={handleSelectChange}
        className={`p-2 border rounded mb-4 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
        value={selectedTrip ? selectedTrip.id : ""}
      >
        <option value="">Select a trip</option>
        {trips.map((trip) => (
          <option key={trip.id} value={trip.id}>
            {trip.pickup_location} ➝ {trip.dropoff_location}, {trip.truckNumber} - {trip.date}
          </option>
        ))}
      </select>

      {selectedTrip && <RouteMap routeData={selectedTrip} trip_id={TripID} />}
    </div>
  );
};

export default ViewRoute;
