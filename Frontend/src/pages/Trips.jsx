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
import ConfirmationModal from "../components/confirmationModal"; // Import the new confirmation modal

const Trips = () => {
  const [trips, setTrips] = useState([]);
  const [open, setOpen] = useState(false);
  const [openConfirmation, setOpenConfirmation] = useState(false); // State to control the confirmation modal
  const [tripToDelete, setTripToDelete] = useState(null); // Store the trip that needs to be deleted

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/trips/", {
          method: 'GET', // Ensure it's a GET request
          headers: {
            'Content-Type': 'application/json', // Inform the server that you're expecting JSON
          },
        });
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        setTrips(data); // Set the fetched trips in state
      } catch (error) {
        console.error("Error fetching trips:", error);
      }
    };
  
    fetchTrips(); // Call the fetchTrips function
  }, []); // Empty dependency array means this runs once when the component mounts
  
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const addTrip = (newTrip) => {
    setTrips([...trips, newTrip]);
    handleClose();
  };

  const openDeleteConfirmation = (trip) => {
    setTripToDelete(trip); // Store the trip to delete
    setOpenConfirmation(true); // Show the confirmation modal
  };

  const closeDeleteConfirmation = () => {
    setOpenConfirmation(false); // Close the confirmation modal
    setTripToDelete(null); // Clear the trip to delete
  };

  const deleteTrip = async () => {
    try {
      // Delete the trip from the backend (optional, depends on your API)
      const response = await fetch(`http://localhost:8000/api/trips/${tripToDelete.id}/`, {
        method: 'DELETE', // Ensure it's a DELETE request
      });

      if (response.ok) {
        // If successful, remove the trip from the state
        setTrips(trips.filter((trip) => trip.id !== tripToDelete.id));
        closeDeleteConfirmation(); // Close the confirmation modal
      } else {
        console.error("Failed to delete the trip");
      }
    } catch (error) {
      console.error("Error deleting trip:", error);
    }
  };

  return (
    <div className="mt-16 p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Your Trips Here</h1>

      <Button variant="contained" color="primary" onClick={handleOpen}>
        Add New Trip
      </Button>

      <TableContainer component={Paper} className="mt-4">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Pickup Location</TableCell>
              <TableCell>Dropoff Location</TableCell>
              <TableCell>Truck Number</TableCell>
              <TableCell>Shipping Doc Number</TableCell>
              <TableCell>Co-Driver</TableCell>
              <TableCell>Miles Driven</TableCell>
              <TableCell>Actions</TableCell> {/* Add Action column */}
            </TableRow>
          </TableHead>
          <TableBody>
            {trips.map((trip) => (
              <TableRow key={trip.id}>
                <TableCell>{trip.date}</TableCell>
                <TableCell>{trip.pickup_location}</TableCell>
                <TableCell>{trip.dropoff_location}</TableCell>
                <TableCell>{trip.truck_number}</TableCell>
                <TableCell>{trip.shipping_doc_number}</TableCell>
                <TableCell>{trip.co_driver || "N/A"}</TableCell>
                <TableCell>{trip.total_miles}</TableCell>
                <TableCell>
                  {/* Action buttons */}
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => openDeleteConfirmation(trip)} // Open confirmation modal
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
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <TripFormModal onSubmit={addTrip} />
        </Box>
      </Modal>

      {/* Confirmation Modal */}
      <ConfirmationModal
        open={openConfirmation}
        onClose={closeDeleteConfirmation}
        onConfirm={deleteTrip} // Call deleteTrip if confirmed
        message="Are you sure you want to delete this trip?"
      />
    </div>
  );
};

export default Trips;
