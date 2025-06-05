import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const fetchPatients = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found. Please login.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/patients", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      // ✅ Safe handling: ensure 'data' is array
      if (Array.isArray(data)) {
        setPatients(data);
      } else if (Array.isArray(data.patients)) {
        setPatients(data.patients);
      } else {
        setPatients([]);
        setError("Unexpected response format from server.");
      }

      setLoading(false);
    } catch (err) {
      setError("Server error while fetching patients");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleDelete = async (id, name) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found. Please login.");
      return;
    }

    if (!window.confirm(`Are you sure you want to delete patient "${name}"?`)) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/patients/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Patient deleted successfully!");
        fetchPatients();
      } else {
        setMessage(data.message || "Failed to delete patient");
      }
    } catch (err) {
      setMessage("Server error while deleting patient");
    }
  };

  if (loading) return <div style={{ padding: "2rem" }}>Loading patients...</div>;

  if (error)
    return (
      <div style={{ padding: "2rem", color: "red" }}>
        {error}
      </div>
    );

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Patient List</h2>
      {message && (
        <p style={{ color: message.includes("successfully") ? "green" : "red" }}>
          {message}
        </p>
      )}
      {Array.isArray(patients) && patients.length === 0 ? (
        <p>No patients found.</p>
      ) : (
        <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ backgroundColor: "#f0f0f0" }}>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Medical History</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient._id}>
                <td>{patient.name}</td>
                <td>{patient.age}</td>
                <td>{patient.gender}</td>
                <td>{patient.medicalHistory}</td>
                <td>
                  <button
                    onClick={() => navigate(`/edit-patient/${patient._id}`)}
                    style={{
                      marginRight: "8px",
                      backgroundColor: "#007bff",
                      color: "white",
                      border: "none",
                      padding: "5px 10px",
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(patient._id, patient.name)}
                    style={{
                      backgroundColor: "red",
                      color: "white",
                      border: "none",
                      padding: "5px 10px",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PatientList;
