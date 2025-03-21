import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Trips from "./pages/Trips";
import ViewRoute from "./pages/ViewRoute";
import ViewLog from "./pages/ViewLog";
import { Box } from "@mui/material";
import Langing from "./components/Langing";
import ManageLogs from "./pages/ManageLogs";

const drawerWidth = 240; // Sidebar width

const App = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <Navbar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      {/* Main Content */}
      <Box component="main" sx={{ marginLeft: isSidebarOpen ? `${drawerWidth}px` : 0, padding: "80px 20px", transition: "margin 0.3s ease" }}>
        <Routes>
          <Route path="/" element={<Langing />} />
          <Route path="/trips" element={<Trips />} />
          <Route path="/view-route" element={<ViewRoute />} />
          <Route path="/view-log" element={<ViewLog />} />
          <Route path="/manage-logs" element={<ManageLogs />} />
        </Routes>
      </Box>
    </Router>
  );
};

export default App;
