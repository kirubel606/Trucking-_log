import React, { useState } from "react";
import { AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemText, ListItemIcon, Typography, Box, CssBaseline } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import MapIcon from "@mui/icons-material/Map";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ManageHistoryIcon from '@mui/icons-material/ManageHistory';
import { Link } from "react-router-dom";

const drawerWidth = 240; // Sidebar width

const NAV_ITEMS = [
  { path: "/trips", title: "Trips", icon: <DirectionsCarIcon /> },
  { path: "/manage-logs", title: "Manage Logs", icon: <ManageHistoryIcon/> },
  { path: "/view-route", title: "View Route", icon: <MapIcon /> },
  { path: "/view-log", title: "Logs", icon: <AssignmentIcon /> },
];

const Navbar = ({ isSidebarOpen, setSidebarOpen }) => {
  return (
    <>
      <CssBaseline />
      {/* Top Navbar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1, // Ensure it's above sidebar
        }}
      >
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => setSidebarOpen(!isSidebarOpen)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Truck Log Book
          </Typography>
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
          "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box", marginTop: "64px" }, // Push down below AppBar
        }}
      >

        <List>
          {NAV_ITEMS.map(({ path, title, icon }) => (
            <ListItem button key={path} component={Link} to={path}>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={title} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default Navbar;
