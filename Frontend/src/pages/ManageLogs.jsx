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
  Snackbar, // Import Snackbar component
  Alert, // Import Alert component for styled messages
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from "axios";

const ManageLogs = ({ darkMode }) => {
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState("");
  const [logs, setLogs] = useState([]);
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentLog, setCurrentLog] = useState(null);
  const [newLog, setNewLog] = useState({
    status: "",
    location: "",
    remarks: "",
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false); // State for snackbar
  const [snackbarMessage, setSnackbarMessage] = useState(""); // State for snackbar message
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // State for snackbar severity (success, error)
  const Base_URL = import.meta.env.VITE_BACKEND_URL;

  // Fetch trips on mount
  useEffect(() => {
    axios.get(`${Base_URL}api/trips/`)
      .then((res) => setTrips(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Fetch logs when a trip is selected
  useEffect(() => {
    if (selectedTrip) {
      axios.get(`${Base_URL}api/logs/?trip_id=${selectedTrip}`)
        .then((res) => setLogs(res.data))
        .catch((err) => console.error(err));
    }
  }, [selectedTrip]);

  // Handle form input changes
  const handleInputChange = (e) => {
    setNewLog({ ...newLog, [e.target.name]: e.target.value });
  };

  // Submit new log entry or update log entry
  const handleSubmit = () => {
    if (isEdit) {
      // Edit log entry
      axios.put(`${Base_URL}api/logs/${currentLog.id}/`, { 
        ...newLog, 
        trip: selectedTrip 
      })
        .then((res) => {
          setLogs(logs.map(log => log.id === currentLog.id ? res.data : log));
          setOpen(false);
          setNewLog({ status: "", location: "", remarks: "" });
          setIsEdit(false);
          setCurrentLog(null);
          setSnackbarMessage("Log entry updated successfully!");
          setSnackbarSeverity("success");
          setSnackbarOpen(true);
        })
        .catch((err) => {
          setSnackbarMessage("Failed to update log entry.");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
          console.error(err);
        });
    } else {
      // Add new log entry
      axios.post(`${Base_URL}api/logs/`, { 
        ...newLog, 
        trip: selectedTrip 
      })
        .then((res) => {
          setLogs([...logs, res.data]);
          setOpen(false);
          setNewLog({ status: "", location: "", remarks: "" });
          setSnackbarMessage("Log entry added successfully!");
          setSnackbarSeverity("success");
          setSnackbarOpen(true);
        })
        .catch((err) => {
          setSnackbarMessage("Failed to add log entry.");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
          console.error(err);
        });
    }
  };

  // Delete log entry handler
  const handleDelete = (logId) => {
    axios.delete(`${Base_URL}api/logs/${logId}/`)
      .then(() => {
        setLogs(logs.filter((log) => log.id !== logId));
        setSnackbarMessage("Log entry deleted successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      })
      .catch((err) => {
        setSnackbarMessage("Failed to delete log entry.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        console.error(err);
      });
  };

  // Handle edit log entry
  const handleEdit = (log) => {
    setCurrentLog(log);
    setNewLog({
      status: log.status,
      location: log.location,
      remarks: log.remarks,
    });
    setIsEdit(true);
    setOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
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
        className={darkMode ? 'bg-gray-900' : 'bg-gray-100'}
        sx={{ mb: 2, color: darkMode ? 'white' : '' }}
        inputProps={{
          MenuProps: {
            MenuListProps: {
              sx: {
                backgroundColor: darkMode ? 'black' : ''
              }
            }
          }
        }}
      >
        <MenuItem className={darkMode ? 'bg-gray-900' : 'bg-gray-100'} sx={{ color: darkMode ? 'white' : 'black' }} value="" disabled>Select a Trip</MenuItem>
        {trips.map((trip) => (
          <MenuItem sx={{ color: darkMode ? 'white' : 'black' }} key={trip.id} value={trip.id}>
            {trip.pickup_location} ➝ {trip.dropoff_location} ({trip.truck_number})
          </MenuItem>
        ))}
      </Select>

      {/* Log Entries Table */}
      {selectedTrip && logs.length > 0 && (
        <Table>
          <TableHead>
            <TableRow className={darkMode ? 'bg-gray-900' : 'bg-gray-100'}>
              <TableCell sx={{ color: darkMode ? 'white' : 'black' }}>Status</TableCell>
              <TableCell sx={{ color: darkMode ? 'white' : 'black' }}>Location</TableCell>
              <TableCell sx={{ color: darkMode ? 'white' : 'black' }}>Remarks</TableCell>
              <TableCell sx={{ color: darkMode ? 'white' : 'black' }}>Timestamp</TableCell>
              <TableCell sx={{ color: darkMode ? 'white' : 'black' }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id} className={darkMode ? 'bg-gray-900 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}>
                <TableCell sx={{ color: darkMode ? 'white' : 'black' }}>{log.status}</TableCell>
                <TableCell sx={{ color: darkMode ? 'white' : 'black' }}>{log.location}</TableCell>
                <TableCell sx={{ color: darkMode ? 'white' : 'black' }}>{log.remarks}</TableCell>
                <TableCell sx={{ color: darkMode ? 'white' : 'black' }}>{new Date(log.timestamp).toLocaleString()}</TableCell>
                <TableCell sx={{ color: darkMode ? 'white' : 'black' }}>
                  <IconButton color="error" onClick={() => handleDelete(log.id)}>
                    <DeleteIcon />
                  </IconButton>
                  <IconButton color="primary" onClick={() => handleEdit(log)}>
                    <EditIcon />
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

      {/* Add/Edit Log Entry Modal */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{isEdit ? 'Edit Log Entry' : 'Add Log Entry'}</DialogTitle>
        <DialogContent>
          <Select
            name="status"
            value={newLog.status}
            onChange={handleInputChange}
            fullWidth
            sx={{ my: 1 }}
          >
            <MenuItem value="Driving">Driving</MenuItem>
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
            sx={{ my: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>{isEdit ? 'Update' : 'Add'}</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for success or error */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ManageLogs;
