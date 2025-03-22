import { useState, useEffect } from "react";
import LogSheet from "../components/LogSheet";

const ViewLog = () => {
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [pdf, setPdf] = useState('');

  // Fetch trips from the backend
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/trips/");
        const data = await response.json();
        setTrips(data);
      } catch (error) {
        console.error("Error fetching trips:", error);
      }
    };
    fetchTrips();
  }, []);

// Fetch logs when a trip is selected
const handleSelectChange = async (e) => {
  const selectedTripId = parseInt(e.target.value, 10);
  const trip = trips.find((trip) => trip.id === selectedTripId);
  setSelectedTrip(trip);

  if (trip) {
    try {
      const response = await fetch(
        `http://localhost:8000/api/generate-log/?trip_id=${trip.id}`
      );
      const blob = await response.blob();
      const pdfUrl = URL.createObjectURL(blob);
      setPdf(pdfUrl);
    } catch (error) {
      console.error("Error fetching PDF:", error);
      setPdf('');
    }
  }
};


  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Generate Log Sheet</h2>
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

      {selectedTrip && <LogSheet  pdf={pdf} />}
    </div>
  );
};

export default ViewLog;
