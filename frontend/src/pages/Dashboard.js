import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // for redirection

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnalytics = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please login.");
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/api/analytics", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const data = await res.json();
          setError(data.message || "Failed to fetch analytics");
          return;
        }

        const data = await res.json();
        setAnalytics(data);
      } catch (err) {
        setError("Server error while fetching analytics");
      }
    };

    fetchAnalytics();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token"); // 🔐 remove auth token
    navigate("/"); // 🔁 redirect to login page ("/login" nahi, kyunki humne login route "/" set kiya hai)
  };

  if (error) {
    return (
      <div style={{ padding: "2rem", color: "red" }}>
        {error}
        <br />
        <button onClick={handleLogout} style={{ marginTop: "1rem" }}>
          Logout
        </button>
      </div>
    );
  }

  if (!analytics) {
    return <div style={{ padding: "2rem" }}>Loading analytics...</div>;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Dashboard - Analytics</h2>
      <button onClick={handleLogout} style={{ marginBottom: "1rem" }}>
        Logout
      </button>

      <div style={{ marginBottom: "1rem" }}>
        <button
          onClick={() => navigate("/patients")}
          style={{ marginRight: "1rem" }}
        >
          View Patients
        </button>
        <button onClick={() => navigate("/add-patient")}>Add New Patient</button>
      </div>

      <p>Total Patients: {analytics.totalPatients}</p>

      <h3>Gender Distribution:</h3>
      <ul>
        {analytics.genderStats.map((item) => (
          <li key={item._id}>
            {item._id || "Unknown"}: {item.count}
          </li>
        ))}
      </ul>

      <h3>Age Groups:</h3>
      <ul>
        {analytics.ageStats.map((item, index) => (
          <li key={index}>
            {typeof item._id === "number"
              ? `${item._id} - ${analytics.ageStats[index + 1]?._id - 1 || "+"}`
              : item._id}
            : {item.count}
          </li>
        ))}
      </ul>

      <h3>Top Medical Conditions:</h3>
      <ul>
        {analytics.conditionStats.map((item) => (
          <li key={item._id}>
            {item._id || "Unknown"}: {item.count}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
