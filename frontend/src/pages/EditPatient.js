import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditPatient = () => {
  const { id } = useParams();  // Get patient ID from URL
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [medicalHistory, setMedicalHistory] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatient = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("No token found. Please login.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`http://localhost:5000/api/patients/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const data = await res.json();
          setMessage(data.message || "Failed to fetch patient");
          setLoading(false);
          return;
        }

        const data = await res.json();
        setName(data.name);
        setAge(data.age);
        setGender(data.gender);
        setMedicalHistory(data.medicalHistory);
        setLoading(false);
      } catch (err) {
        setMessage("Server error while fetching patient");
        setLoading(false);
      }
    };

    fetchPatient();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("No token found. Please login.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/patients/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, age, gender, medicalHistory }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Patient updated successfully!");
        setTimeout(() => {
          navigate("/patients");
        }, 1500);
      } else {
        setMessage(data.message || "Failed to update patient");
      }
    } catch (err) {
      setMessage("Server error while updating patient");
    }
  };

  if (loading) return <div style={{ padding: "2rem" }}>Loading patient data...</div>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Edit Patient</h2>
      {message && (
        <p style={{ color: message.includes("successfully") ? "green" : "red" }}>
          {message}
        </p>
      )}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label><br />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <br />
        <div>
          <label>Age:</label><br />
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
            required
          />
        </div>
        <br />
        <div>
          <label>Gender:</label><br />
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <br />
        <div>
          <label>Medical History:</label><br />
          <textarea
            rows="4"
            value={medicalHistory}
            onChange={(e) => setMedicalHistory(e.target.value)}
            required
            style={{ width: "100%" }}
          />
        </div>
        <br />
        <button type="submit" style={{ padding: "8px 16px" }}>Update Patient</button>
      </form>
    </div>
  );
};

export default EditPatient;
