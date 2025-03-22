import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Modal,
  Box,
} from "@mui/material";
import TripFormModal from "../components/TripFormModal";
import ConfirmationModal from "../components/confirmationModal";

const Trips = ({ darkMode }) => {
  const [trips, setTrips] = useState([]);
  const [open, setOpen] = useState(false);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [tripToDelete, setTripToDelete] = useState(null);
  const [editingTrip, setEditingTrip] = useState(null); // Store trip for editing

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/trips/");
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setTrips(data);
      } catch (error) {
        console.error("Error fetching trips:", error);
      }
    };
    fetchTrips();
  }, []);

  // Open modal for creating or editing a trip
  const handleOpen = (trip = null) => {
    setEditingTrip(trip); // Set trip to edit, or null for new trip
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setEditingTrip(null); // Clear editing trip when modal closes
  };

  // Add or update trip in state
  const saveTrip = (trip) => {
    if (editingTrip) {
      // Update existing trip
      setTrips(trips.map((t) => (t.id === trip.id ? trip : t)));
    } else {
      // Add new trip
      setTrips([...trips, trip]);
    }
    handleClose();
  };

  const openDeleteConfirmation = (trip) => {
    setTripToDelete(trip);
    setOpenConfirmation(true);
  };

  const closeDeleteConfirmation = () => {
    setOpenConfirmation(false);
    setTripToDelete(null);
  };

  const deleteTrip = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/trips/${tripToDelete.id}/`, {
        method: "DELETE",
      });

      if (response.ok) {
        setTrips(trips.filter((trip) => trip.id !== tripToDelete.id));
        closeDeleteConfirmation();
      } else {
        console.error("Failed to delete the trip");
      }
    } catch (error) {
      console.error("Error deleting trip:", error);
    }
  };

  return (
    <div className={`mt-16 p-4 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <h1 className="text-2xl font-bold mb-4">Manage Your Trips Here</h1>

      <Button 
        variant="contained" 
        color={darkMode ? "secondary" : "primary"} 
        onClick={() => handleOpen()}
      >
        Add New Trip
      </Button>

      <TableContainer 
  component={Paper} 
  className={`mt-4 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
>
  <Table>
    <TableHead>
    <TableRow className={darkMode ? 'bg-gray-900' : 'bg-gray-100'}>
  <TableCell sx={{ color: darkMode ? 'white' : 'black' }}>Date</TableCell>
  <TableCell sx={{ color: darkMode ? 'white' : 'black' }}>Pickup Location</TableCell>
  <TableCell sx={{ color: darkMode ? 'white' : 'black' }}>Dropoff Location</TableCell>
  <TableCell sx={{ color: darkMode ? 'white' : 'black' }}>Truck Number</TableCell>
  <TableCell sx={{ color: darkMode ? 'white' : 'black' }}>Shipping Doc Number</TableCell>
  <TableCell sx={{ color: darkMode ? 'white' : 'black' }}>Co-Driver</TableCell>
  <TableCell sx={{ color: darkMode ? 'white' : 'black' }}>Miles Driven</TableCell>
  <TableCell sx={{ color: darkMode ? 'white' : 'black' }}>Actions</TableCell>
</TableRow>

    </TableHead>
    <TableBody>
      {trips.map((trip) => (
        <TableRow 
          key={trip.id} 
          className={darkMode ? 'bg-gray-900 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}
          
        >
          <TableCell sx={{ color: darkMode ? 'white' : 'black' }}>{trip.date}</TableCell>
          <TableCell sx={{ color: darkMode ? 'white' : 'black' }}>{trip.pickup_location}</TableCell>
          <TableCell sx={{ color: darkMode ? 'white' : 'black' }}>{trip.dropoff_location}</TableCell>
          <TableCell sx={{ color: darkMode ? 'white' : 'black' }}>{trip.truck_number}</TableCell>
          <TableCell sx={{ color: darkMode ? 'white' : 'black' }}>{trip.shipping_doc_number}</TableCell>
          <TableCell sx={{ color: darkMode ? 'white' : 'black' }}>{trip.co_driver || "N/A"}</TableCell>
          <TableCell sx={{ color: darkMode ? 'white' : 'black' }}>{trip.total_miles}</TableCell>
          <TableCell sx={{ color: darkMode ? 'white' : 'black' }}>
            {/* Edit Button */}
            <Button
              variant={darkMode ? "contained":"outlined"}
              color={darkMode ? "secondary" : "primary"}
              onClick={() => handleOpen(trip)}
              style={{ marginRight: "10px" }}
            >
              Edit
            </Button>
            {/* Delete Button */}
            <Button 
              variant={darkMode ? "contained":"outlined"}
              color={darkMode ? "error" : "secondary"} 
              onClick={() => openDeleteConfirmation(trip)}
            >
              Delete
            </Button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>


      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 700,
            bgcolor: darkMode ? "background.default" : "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <TripFormModal onSubmit={saveTrip} tripData={editingTrip} />
        </Box>
      </Modal>

      <ConfirmationModal open={openConfirmation} onClose={closeDeleteConfirmation} onConfirm={deleteTrip} message="Are you sure you want to delete this trip?" />
    </div>
  );
};

export default Trips;
