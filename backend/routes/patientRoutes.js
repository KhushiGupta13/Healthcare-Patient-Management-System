const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const { protect } = require('../middleware/authMiddleware'); // Authentication middleware
const { authorizeRoles } = require('../middleware/roleMiddleware'); // Role based middleware
const { Parser } = require('json2csv'); // CSV export library

// Export patients to CSV
router.get('/export/csv', protect, async (req, res) => {
  try {
    const patients = await Patient.find({});
    if (!patients.length) {
      return res.status(404).json({ message: 'No patient records found' });
    }

    const fields = ['name', 'age', 'gender', 'address', 'phone', 'email', 'medicalHistory'];
    const parser = new Parser({ fields });
    const csv = parser.parse(patients);

    res.header('Content-Type', 'text/csv');
    res.attachment('patients.csv');
    return res.send(csv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Analytics route - returns total patients, average age, and gender distribution
router.get('/analytics', protect, async (req, res) => {
  try {
    const total = await Patient.countDocuments();

    const genderStats = await Patient.aggregate([
      { $group: { _id: "$gender", count: { $sum: 1 } } }
    ]);

    const avgAge = await Patient.aggregate([
      { $group: { _id: null, averageAge: { $avg: "$age" } } }
    ]);

    res.json({
      totalPatients: total,
      genderStats,
      averageAge: avgAge[0]?.averageAge ? Number(avgAge[0].averageAge.toFixed(2)) : 0,
    });
  } catch (err) {
    res.status(500).json({ message: "Analytics fetch error" });
  }
});

// Get all patients with optional search, pagination, and sorting
router.get('/', protect, async (req, res) => {
  try {
    const { search, condition, page = 1, limit = 10, sort = 'name' } = req.query;

    const query = {};
    if (search) query.name = { $regex: search, $options: 'i' };
    if (condition) query.medicalHistory = { $regex: condition, $options: 'i' };

    const options = {
      skip: (parseInt(page) - 1) * parseInt(limit),
      limit: parseInt(limit),
      sort: { [sort]: 1 },
    };

    const patients = await Patient.find(query, null, options);
    const total = await Patient.countDocuments(query);

    res.json({
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      patients,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get patient by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json(patient);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new patient
router.post('/', protect, async (req, res) => {
  const patient = new Patient({
    name: req.body.name,
    age: req.body.age,
    gender: req.body.gender,
    address: req.body.address,
    phone: req.body.phone,
    email: req.body.email,
    medicalHistory: req.body.medicalHistory,
  });

  try {
    const newPatient = await patient.save();
    res.status(201).json(newPatient);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update patient
router.put('/:id', protect, async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json(patient);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete patient - only admin allowed
router.delete('/:id', protect, authorizeRoles(['admin']), async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json({ message: 'Patient deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
