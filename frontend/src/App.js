import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PatientList from "./pages/PatientList";
import AddPatient from "./pages/AddPatient";
import EditPatient from "./pages/EditPatient"; // ✅ Edit page
import Analytics from "./pages/Analytics"; // ✅ NEW: Analytics page
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public route */}
        <Route path="/" element={<Login />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patients"
          element={
            <ProtectedRoute>
              <PatientList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-patient"
          element={
            <ProtectedRoute>
              <AddPatient />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-patient/:id"
          element={
            <ProtectedRoute>
              <EditPatient />
            </ProtectedRoute>
          }
        />
        {/* ✅ New Analytics Route */}
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
