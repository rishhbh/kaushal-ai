const asyncHandler = require('express-async-handler');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// @desc    Get all courses
// @route   GET /api/courses
const getCourses = asyncHandler(async (req, res) => {
  const { trade, level } = req.query;
  const filter = {};
  if (trade) filter.trade = trade;
  if (level) filter.level = level;

  const courses = await Course.find(filter).select('-modules.contentText -modules.quiz');
  res.status(200).json({ success: true, count: courses.length, data: courses });
});

// @desc    Get single course
// @route   GET /api/courses/:id
const getCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    res.status(404); throw new Error('Course not found');
  }
  res.status(200).json({ success: true, data: course });
});

// @desc    Enroll worker in a course
// @route   POST /api/courses/:id/enroll
const enrollCourse = asyncHandler(async (req, res) => {
  const courseId = req.params.id;
  const userId = req.user._id;

  const course = await Course.findById(courseId);
  if (!course) {
    res.status(404); throw new Error('Course not found');
  }

  // Check if already enrolled
  const existingEnrollment = await Enrollment.findOne({ userId, courseId });
  if (existingEnrollment) {
    res.status(400); throw new Error('Already enrolled in this course');
  }

  const enrollment = await Enrollment.create({
    userId,
    courseId,
    moduleProgress: course.modules.map(m => ({
      moduleId: m._id,
      completed: false
    }))
  });

  // Update user profile
  req.user.enrolledCourses.push(courseId);
  await req.user.save();

  res.status(201).json({ success: true, data: enrollment });
});

// @desc    Update module progress
// @route   PATCH /api/courses/:id/progress
const updateProgress = asyncHandler(async (req, res) => {
  const courseId = req.params.id;
  const userId = req.user._id;
  const { moduleId, score } = req.body;

  const enrollment = await Enrollment.findOne({ userId, courseId });
  if (!enrollment) {
    res.status(404); throw new Error('Enrollment not found');
  }

  const moduleProg = enrollment.moduleProgress.find(m => m.moduleId.toString() === moduleId);
  if (!moduleProg) {
    res.status(404); throw new Error('Module not found in enrollment');
  }

  moduleProg.completed = true;
  moduleProg.score = score;
  moduleProg.completedAt = Date.now();

  enrollment.currentModuleIndex = Math.min(
    enrollment.currentModuleIndex + 1,
    enrollment.moduleProgress.length
  );

  const allCompleted = enrollment.moduleProgress.every(m => m.completed);
  if (allCompleted) {
    enrollment.completedAt = Date.now();
  }

  await enrollment.save();

  res.status(200).json({ success: true, data: enrollment });
});

module.exports = { getCourses, getCourse, enrollCourse, updateProgress };
