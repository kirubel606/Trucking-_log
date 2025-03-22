import React from "react";
import { useLocation, Link } from "react-router-dom";
import { AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemText, ListItemIcon, Typography, CssBaseline } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import MapIcon from "@mui/icons-material/Map";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ManageHistoryIcon from '@mui/icons-material/ManageHistory';
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

const drawerWidth = 240; // Sidebar width

const NAV_ITEMS = [
  { path: "/trips", title: "Trips", icon: <DirectionsCarIcon /> },
  { path: "/manage-logs", title: "Manage Logs", icon: <ManageHistoryIcon /> },
  { path: "/view-route", title: "View Route", icon: <MapIcon /> },
  { path: "/view-log", title: "Logs", icon: <AssignmentIcon /> },
];

const Navbar = ({ isSidebarOpen, setSidebarOpen, darkMode, setDarkMode }) => {
  const location = useLocation(); // Get current route

  return (
    <>
      <CssBaseline />
      {/* Top Navbar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1, // Ensure it's above sidebar
          backgroundColor: darkMode ? "#1e1e1e" : "#1976d2", // Dark mode support
        }}
      >
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => setSidebarOpen(!isSidebarOpen)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            DDLA
          </Typography>

          {/* Dark Mode Toggle Button */}
          <IconButton color="inherit" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant="persistent"
        anchor="left"
        open={isSidebarOpen}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          zIndex: (theme) => theme.zIndex.appBar - 1, // Ensure it's below navbar
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            marginTop: "64px", // Push down below AppBar
            backgroundColor: darkMode ? "#121212" : "#fff", // Dark mode for sidebar
            color: darkMode ? "#fff" : "#000", // Ensure text color changes
          },
        }}
      >
        <List>
          {NAV_ITEMS.map(({ path, title, icon }) => {
            const isActive = location.pathname === path; // Check if this item is active
            return (
              <ListItem
                button
                key={path}
                component={Link}
                to={path}
                sx={{
                  backgroundColor: isActive ? (darkMode ? "#333" : "#ddd") : "inherit", // Highlight active item
                  color: isActive ? (darkMode ? "#fff" : "#000") : "inherit",
                  borderRadius: "8px",
                  margin: "4px",
                }}
              >
                <ListItemIcon sx={{ color: isActive ? "#1976d2" : darkMode ? "#fff" : "#000" }}>
                  {icon}
                </ListItemIcon>
                <ListItemText primary={title} />
              </ListItem>
            );
          })}
        </List>
      </Drawer>
    </>
  );
};

export default Navbar;
