const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  employerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employer', required: true },
  companyName: String,
  title: { type: String, required: true },
  trade: String,
  level: String,
  location: String,
  salaryMin: Number,
  salaryMax: Number,
  description: String,
  requiredCertifications: [String],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Job', jobSchema);
