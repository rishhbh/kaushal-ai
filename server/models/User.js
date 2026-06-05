const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, enum: ['worker', 'employer'], default: 'worker' },
  email: { 
    type: String, 
    sparse: true, 
    unique: true,
    required: function() { return this.role === 'employer'; }
  },
  phone: { 
    type: String, 
    sparse: true, 
    unique: true, 
    required: function() { return this.role === 'worker'; }
  },
  district: String,
  state: String,
  trade: String,
  experience: Number,
  language: String,
  skillLevel: String,
  passwordHash: String,
  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  assessmentSkipped: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
