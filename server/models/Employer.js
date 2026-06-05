const mongoose = require('mongoose');

const employerSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  gst: String,
  industry: String,
  companySize: String,
  city: String,
  state: String,
  contactName: String,
  email: { type: String, required: true, unique: true },
  passwordHash: String,
  postedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Employer', employerSchema);
