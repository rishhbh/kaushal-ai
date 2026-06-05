const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  currentModuleIndex: { type: Number, default: 0 },
  moduleProgress: [
    {
      moduleId: mongoose.Schema.Types.ObjectId,
      completed: { type: Boolean, default: false },
      score: Number,
      completedAt: Date
    }
  ],
  completedAt: Date,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Enrollment', enrollmentSchema);
