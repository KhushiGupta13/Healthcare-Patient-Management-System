const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// Analytics route - only accessible by admin users
router.get('/', protect, authorizeRoles(['admin']), async (req, res) => {
  try {
    // Total number of patients
    const totalPatients = await Patient.countDocuments();

    // Count patients grouped by gender
    const genderStats = await Patient.aggregate([
      { $group: { _id: '$gender', count: { $sum: 1 } } }
    ]);

    // Count patients grouped by age ranges
    const ageStats = await Patient.aggregate([
      {
        $bucket: {
          groupBy: "$age",
          boundaries: [0, 18, 35, 50, 65, 120],
          default: "Unknown",
          output: { count: { $sum: 1 } }
        }
      }
    ]);

    // Top 5 common medical conditions (for string type medicalHistory)
    const conditionStats = await Patient.aggregate([
      { $group: { _id: "$medicalHistory", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      totalPatients,
      genderStats,
      ageStats,
      conditionStats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
