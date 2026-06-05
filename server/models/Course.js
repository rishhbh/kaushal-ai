const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
  title: String,
  orderIndex: Number,
  contentText: String,
  quiz: [
    {
      question: String,
      options: [String],
      correctIndex: Number
    }
  ]
});

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  trade: { type: String, required: true },
  level: String,
  durationHrs: Number,
  description: String,
  isExample: { type: Boolean, default: false },
  modules: [moduleSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Course', courseSchema);
