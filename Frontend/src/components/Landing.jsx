import React from "react";
import { Button, Typography, Box } from "@mui/material";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-900 dark:to-gray-800 text-white">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          textAlign: "center",
          padding: "20px",
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontWeight: "extrabold",
            fontSize: "3rem",
            marginBottom: "20px",
            color: "inherit",
          }}
        >
          Welcome to the Drivers Daily Logs App
        </Typography>

        <Typography
          variant="h6"
          sx={{
            marginBottom: "40px",
            maxWidth: "600px",
            fontSize: "1.25rem",
            lineHeight: 1.8,
            color: "inherit",
          }}
        >
          This app helps drivers keep track of their daily logs efficiently and ensures compliance with regulations while providing an easy-to-use interface. Stay on top of your route, logs, and more!
        </Typography>

        <Button
          variant="contained"
          sx={{
            backgroundColor: "#1976d2",
            fontSize: "1.2rem",
            padding: "10px 20px",
            borderRadius: "50px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            "&:hover": {
              backgroundColor: "#1565c0",
              transform: "scale(1.05)",
            },
            transition: "transform 0.3s ease, background-color 0.3s ease",
          }}
          href="/trips"
        >
          Get Started
        </Button>
      </Box>

      {/* Features Section */}
      <Box
        sx={{
          backgroundColor: "#121212",
          color: "#fff",
          padding: "40px 20px",
          textAlign: "center",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            marginBottom: "30px",
          }}
        >
          Features That Make Your Life Easier
        </Typography>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="feature-card">
            <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: "15px" }}>
              Route Tracking
            </Typography>
            <Typography>
              Track your routes in real-time with automatic log updates and route suggestions.
            </Typography>
          </div>
          <div className="feature-card">
            <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: "15px" }}>
              Compliance Reports
            </Typography>
            <Typography>
              Get daily and weekly reports to stay compliant with transportation regulations.
            </Typography>
          </div>
          <div className="feature-card">
            <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: "15px" }}>
              Easy to Use
            </Typography>
            <Typography>
              A user-friendly interface designed for drivers to quickly log their information without hassle.
            </Typography>
          </div>
        </div>
      </Box>

      {/* Footer Section */}
      <Box
        sx={{
          backgroundColor: "#333",
          color: "#fff",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <Typography variant="body1">© 2025 Truck Log Book | All Rights Reserved</Typography>
      </Box>
    </div>
  );
};

export default Landing;
