import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Trips from "./pages/Trips";
import ViewRoute from "./pages/ViewRoute";
import ViewLog from "./pages/ViewLog";
import { Box } from "@mui/material";
import Landing from "./components/Landing";
import ManageLogs from "./pages/ManageLogs";

const drawerWidth = 240; // Sidebar width

const App = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  
  // Move darkMode state to App
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");

  // Use useEffect to apply the dark theme to document based on the darkMode state
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  }, [darkMode]);

  return (
    <Router>
      <Navbar
        isSidebarOpen={isSidebarOpen}
        setSidebarOpen={setSidebarOpen}
        darkMode={darkMode} // Pass darkMode state to Navbar
        setDarkMode={setDarkMode} // Pass setDarkMode function to Navbar
      />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          marginLeft: isSidebarOpen ? `${drawerWidth}px` : 0,
          padding: "80px 20px",
          transition: "margin 0.3s ease",
          backgroundColor: darkMode ? "#121212" : "#f4f4f4", // Apply background color based on dark mode
          color: darkMode ? "#fff" : "#000", // Apply text color based on dark mode
          minHeight: "100vh", // Ensure full height
        }}
      >
        <Routes>
          <Route path="/" element={<Landing/>} />
          <Route path="/trips" element={<Trips darkMode={darkMode} />} />
          <Route path="/view-route" element={<ViewRoute  darkMode={darkMode}/>} />
          <Route path="/view-log" element={<ViewLog darkMode={darkMode} />} />
          <Route path="/manage-logs" element={<ManageLogs darkMode={darkMode} />} />
        </Routes>
      </Box>
    </Router>
  );
};

export default App;
