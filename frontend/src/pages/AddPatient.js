import React, { useState } from "react";

const AddPatient = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [medicalHistory, setMedicalHistory] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("No token found. Please login.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/patients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, age: Number(age), gender, medicalHistory }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Patient added successfully!");
        setName("");
        setAge("");
        setGender("");
        setMedicalHistory("");
      } else {
        setMessage(data.message || "Failed to add patient");
      }
    } catch (err) {
      setMessage("Server error while adding patient");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Add New Patient</h2>
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
            min="0"
            value={age}
            onChange={(e) => setAge(e.target.value)}
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
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <br />
        <div>
          <label>Medical History:</label><br />
          <input
            type="text"
            value={medicalHistory}
            onChange={(e) => setMedicalHistory(e.target.value)}
            required
          />
        </div>
        <br />
        <button type="submit">Add Patient</button>
      </form>
      {message && (
        <p
          style={{
            marginTop: "1rem",
            color: message.includes("successfully") ? "green" : "red",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default AddPatient;
