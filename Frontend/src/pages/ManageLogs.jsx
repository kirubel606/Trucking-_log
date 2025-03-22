import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Select,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import axios from "axios";

const ManageLogs = () => {
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState("");
  const [logs, setLogs] = useState([]);
  const [open, setOpen] = useState(false);
  const [newLog, setNewLog] = useState({
    status: "",
    location: "",
    remarks: "",
  });

  // Fetch trips on mount
  useEffect(() => {
    axios.get("http://localhost:8000/api/trips/") // Adjust endpoint as needed
      .then((res) => setTrips(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Fetch logs when a trip is selected
  useEffect(() => {
    if (selectedTrip) {
      axios.get(`http://localhost:8000/api/logs/?trip_id=${selectedTrip}`)
        .then((res) => setLogs(res.data))
        .catch((err) => console.error(err));
    }
  }, [selectedTrip]);

  // Handle form input changes
  const handleInputChange = (e) => {
    setNewLog({ ...newLog, [e.target.name]: e.target.value });
  };

  // Submit new log entry
  const handleSubmit = () => {
    axios.post("http://localhost:8000/api/logs/", { ...newLog, trip: selectedTrip })
      .then((res) => {
        setLogs([...logs, res.data]); // Add new log to the list
        setOpen(false);
        setNewLog({ status: "", location: "", remarks: "" }); // Reset form
      })
      .catch((err) => console.error(err));
  };

  // Delete log entry handler
  const handleDelete = (logId) => {
    axios.delete(`http://localhost:8000/api/logs/${logId}/`)
      .then(() => {
        // Filter out the deleted log from the list
        setLogs(logs.filter((log) => log.id !== logId));
      })
      .catch((err) => console.error(err));
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Manage Log Entries</Typography>

      {/* Trip Selector */}
      <Select
        value={selectedTrip}
        onChange={(e) => setSelectedTrip(e.target.value)}
        displayEmpty
        fullWidth
        sx={{ mb: 2 }}
      >
        <MenuItem value="" disabled>Select a Trip</MenuItem>
        {trips.map((trip) => (
          <MenuItem key={trip.id} value={trip.id}>
            {trip.pickup_location} ➝ {trip.dropoff_location} ({trip.truck_number})
          </MenuItem>
        ))}
      </Select>

      {/* Log Entries Table */}
      {selectedTrip && logs.length > 0 && (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Status</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Remarks</TableCell>
              <TableCell>Timestamp</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>{log.status}</TableCell>
                <TableCell>{log.location}</TableCell>
                <TableCell>{log.remarks}</TableCell>
                <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                <TableCell>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(log.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Add Log Entry Button */}
      {selectedTrip && (
        <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => setOpen(true)}>
          Add Log Entry
        </Button>
      )}

      {/* Add Log Entry Modal */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add Log Entry</DialogTitle>
        <DialogContent>
          <Select
            name="status"
            value={newLog.status}
            onChange={handleInputChange}
            fullWidth
            sx={{ my: 1 }}
          >
            <MenuItem value="Driving">Driving</MenuItem>
            <MenuItem value="Resting">Resting</MenuItem>
            <MenuItem value="Fueling">Fueling</MenuItem>
            <MenuItem value="On Duty (Not Driving)">On Duty (Not Driving)</MenuItem>
            <MenuItem value="Off Duty">Off Duty</MenuItem>
            <MenuItem value="Sleeper Berth">Sleeper Berth</MenuItem>
          </Select>
          <TextField
            name="location"
            label="Location"
            value={newLog.location}
            onChange={handleInputChange}
            fullWidth
            sx={{ my: 1 }}
          />
          <TextField
            name="remarks"
            label="Remarks"
            value={newLog.remarks}
            onChange={handleInputChange}
            fullWidth
            multiline
            rows={3}
            sx={{ my: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ManageLogs;
