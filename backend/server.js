const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");  // <-- Add cors import

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON request bodies
app.use(cors());            // <-- Add cors middleware here
app.use(express.json());

// Import route files
const patientRoutes = require("./routes/patientRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

// Import analytics route (new)
const analyticsRoutes = require("./routes/analyticsRoutes");

// Use routes
app.use("/api/patients", patientRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/analytics", analyticsRoutes);  // <-- Analytics route added here

// Default route for testing
app.get("/", (req, res) => {
  res.send("Welcome to Healthcare Patient Management System API");
});

// Connect to MongoDB and start the server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});
