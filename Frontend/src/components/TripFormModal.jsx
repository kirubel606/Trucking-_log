import { useState, useEffect } from "react";
import { TextField, Button } from "@mui/material";

const TripFormModal = ({ onSubmit, tripData }) => {
  // State to hold form values
  const [pickup_location, setPickupLocation] = useState("");
  const [dropoff_location, setDropoffLocation] = useState("");
  const [cycle_hours, setCurrentCycleHours] = useState("");
  const [truck_number, setTruckNumber] = useState("");
  const [shipping_doc_number, setShippingDocNumber] = useState("");
  const [co_driver, setCoDriver] = useState("");
  const [carrier_name, setcarrier_name] = useState("");
  const [office_address, setoffice_address] = useState("");
  const [total_miles, setMilesDriven] = useState("");
  const [date, setDate] = useState("");
  const [current_location, setCurrentLocation] = useState("");
  const [driver_initials, setDriverInitials] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Populate form fields with existing data if tripData is provided
  useEffect(() => {
    if (tripData) {
      setPickupLocation(tripData.pickup_location || "");
      setDropoffLocation(tripData.dropoff_location || "");
      setCurrentCycleHours(tripData.cycle_hours || "");
      setTruckNumber(tripData.truck_number || "");
      setShippingDocNumber(tripData.shipping_doc_number || "");
      setCoDriver(tripData.co_driver || "");
      setcarrier_name(tripData.carrier_name || "");
      setoffice_address(tripData.office_address || "");
      setMilesDriven(tripData.total_miles || "");
      setDate(tripData.date || "");
      setCurrentLocation(tripData.current_location || "");
      setDriverInitials(tripData.driver_initials || "");
    }
  }, [tripData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cycleHoursValue = cycle_hours ? parseInt(cycle_hours) : 0;
    const milesDrivenValue = total_miles ? parseInt(total_miles) : 0;

    const formData = {
      current_location,
      pickup_location,
      dropoff_location,
      cycle_hours: cycleHoursValue,
      truck_number,
      shipping_doc_number,
      co_driver,
      carrier_name,
      office_address,
      total_miles: milesDrivenValue,
      date,
      driver_initials,
    };

    try {
      setLoading(true);
      setError(null);

      const method = tripData ? "PUT" : "POST"; // Use PUT for editing, POST for creating
      const url = tripData
        ? `http://localhost:8000/api/trips/${tripData.id}/` // Assuming the trip has an id
        : "http://localhost:8000/api/trips/submit_trip/";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to save trip log");
      }

      const tripResponse = await response.json();

      onSubmit(tripResponse);

      setPickupLocation("");
      setDropoffLocation("");
      setCurrentCycleHours("");
      setTruckNumber("");
      setShippingDocNumber("");
      setCoDriver("");
      setcarrier_name("");
      setoffice_address("");
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
          value={pickup_location}
          onChange={(e) => setPickupLocation(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Dropoff Location</label>
        <input
          type="text"
          value={dropoff_location}
          onChange={(e) => setDropoffLocation(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Current Location</label>
        <input
          type="text"
          value={current_location}
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
          value={truck_number}
          onChange={(e) => setTruckNumber(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Shipping Document Number</label>
        <input
          type="text"
          value={shipping_doc_number}
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
        <label className="block text-sm font-medium text-gray-700">carrier_name</label>
        <input
          type="text"
          value={carrier_name}
          onChange={(e) => setcarrier_name(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">office_address</label>
        <input
          type="text"
          value={office_address}
          onChange={(e) => setoffice_address(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Co-Driver (if applicable)</label>
        <input
          type="text"
          value={co_driver}
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
        {loading ? "Generating Log Sheet..." : tripData ? "Edit Log Sheet" : "Generate Log Sheet"}
      </button>
    </form>
  );
};

export default TripFormModal;
