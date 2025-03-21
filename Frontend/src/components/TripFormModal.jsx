// src/components/TripForm.jsx
import { useState } from "react";
import { TextField, Button } from "@mui/material";

const TripFormModal = ({ onSubmit }) => {
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [cycle_hours, setCurrentCycleHours] = useState("");
  const [truckNumber, setTruckNumber] = useState("");
  const [shippingDocNumber, setShippingDocNumber] = useState("");
  const [coDriver, setCoDriver] = useState("");
  const [total_miles, setMilesDriven] = useState("");
  const [date, setDate] = useState("");
  const [currentLocation, setCurrentLocation] = useState(""); // For current location
  const [driver_initials, setDriverInitials] = useState(""); // For driver initials
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Set defaults for numeric fields if empty
    const cycleHoursValue = cycle_hours ? parseFloat(cycle_hours) : 0;
    const milesDrivenValue = total_miles ? parseFloat(total_miles) : 0;

    // Gather form data, ensuring no nulls are sent
    const formData = {
      currentLocation,
      pickupLocation,
      dropoffLocation,
      cycle_hours: cycleHoursValue,
      truckNumber,
      shippingDocNumber,
      coDriver,
      total_miles: milesDrivenValue,
      date,
      driver_initials,  // Include driver initials
    };

    try {
      setLoading(true);
      setError(null);

      // Send POST request to the backend
      const response = await fetch("http://localhost:8000/api/trips/submit_trip/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to create trip log");
      }

      const tripResponse = await response.json();

      // Pass the response data to the parent component
      onSubmit(tripResponse);

      // Reset the form fields
      setPickupLocation("");
      setDropoffLocation("");
      setCurrentCycleHours("");
      setTruckNumber("");
      setShippingDocNumber("");
      setCoDriver("");
      setMilesDriven("");
      setDate("");
      setCurrentLocation("");
      setDriverInitials("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Pickup Location</label>
        <input
          type="text"
          value={pickupLocation}
          onChange={(e) => setPickupLocation(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Dropoff Location</label>
        <input
          type="text"
          value={dropoffLocation}
          onChange={(e) => setDropoffLocation(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Current Location</label>
        <input
          type="text"
          value={currentLocation}
          onChange={(e) => setCurrentLocation(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Current Cycle Hours</label>
        <input
          type="number"
          value={cycle_hours}
          onChange={(e) => setCurrentCycleHours(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Truck Number</label>
        <input
          type="text"
          value={truckNumber}
          onChange={(e) => setTruckNumber(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Shipping Document Number</label>
        <input
          type="text"
          value={shippingDocNumber}
          onChange={(e) => setShippingDocNumber(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Driver Initials</label>
        <input
          type="text"
          value={driver_initials}
          onChange={(e) => setDriverInitials(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Co-Driver (if applicable)</label>
        <input
          type="text"
          value={coDriver}
          onChange={(e) => setCoDriver(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Total Miles Driven</label>
        <input
          type="number"
          value={total_miles}
          onChange={(e) => setMilesDriven(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <button
        type="submit"
        className="mt-4 w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? "Generating Log Sheet..." : "Generate Log Sheet"}
      </button>
    </form>
  );
};

export default TripFormModal;
