const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  employerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employer', required: true },
  status: { type: String, default: 'Applied' },
  appliedAt: { type: Date, default: Date.now },
  updatedAt: Date
});

module.exports = mongoose.model('Application', applicationSchema);
