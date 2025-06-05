import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"; // ✅ Import recharts

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login to view analytics.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/api/patients/analytics", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (res.ok) {
          setStats(data);
        } else {
          setError(data.message || "Failed to fetch analytics");
        }
      } catch (err) {
        setError("Server error while fetching analytics");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) return <div style={{ padding: "2rem" }}>Loading analytics...</div>;
  if (error) return <div style={{ padding: "2rem", color: "red" }}>{error}</div>;

  const chartData = stats.genderStats.map((g) => ({
    gender: g._id.charAt(0).toUpperCase() + g._id.slice(1),
    count: g.count,
  }));

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Patient Analytics</h2>
      <p><strong>Total Patients:</strong> {stats.totalPatients}</p>
      <p><strong>Average Age:</strong> {stats.averageAge}</p>

      <h4>Gender Distribution:</h4>
      <ul>
        {stats.genderStats.map((g) => (
          <li key={g._id}>
            {g._id.charAt(0).toUpperCase() + g._id.slice(1)}: {g.count}
          </li>
        ))}
      </ul>

      {/* ✅ Bar Chart for Gender Distribution */}
      <div style={{ width: "100%", height: 300, marginTop: "2rem" }}>
        <ResponsiveContainer>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="gender" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Analytics;
