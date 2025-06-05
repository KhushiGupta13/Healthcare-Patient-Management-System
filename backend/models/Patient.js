const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: Number,
  gender: String,
  address: String,
  phone: String,
  email: String,
  medicalHistory: String,
}, {
  timestamps: true,  // CreatedAt, UpdatedAt automatically add karta hai
});

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;
