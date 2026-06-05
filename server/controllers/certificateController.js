const asyncHandler = require('express-async-handler');
const Certificate = require('../models/Certificate');
const Course = require('../models/Course');
const crypto = require('crypto');

// @desc    Generate a certificate
// @route   POST /api/certificates/generate
const generateCertificate = asyncHandler(async (req, res) => {
  const { courseId } = req.body;
  const user = req.user;

  const course = await Course.findById(courseId);
  if (!course) {
    res.status(404); throw new Error('Course not found');
  }

  // Check if already generated
  const existing = await Certificate.findOne({ userId: user._id, courseId });
  if (existing) {
    return res.status(200).json({ success: true, data: existing });
  }

  const certUUID = `KAUSHAL-${new Date().getFullYear()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

  const certificate = await Certificate.create({
    userId: user._id,
    courseId,
    certUUID,
    workerName: user.name,
    courseName: course.title,
    trade: course.trade,
    skillLevel: course.level || 'Beginner'
  });

  res.status(201).json({ success: true, data: certificate });
});

// @desc    Get worker's certificates
// @route   GET /api/certificates/my
const getMyCertificates = asyncHandler(async (req, res) => {
  const certificates = await Certificate.find({ userId: req.user._id }).sort({ issuedAt: -1 });
  res.status(200).json({ success: true, count: certificates.length, data: certificates });
});

// @desc    Verify certificate public
// @route   GET /api/certificates/:certUUID
const verifyCertificate = asyncHandler(async (req, res) => {
  const certificate = await Certificate.findOne({ certUUID: req.params.certUUID });
  if (!certificate) {
    res.status(404); throw new Error('Invalid Certificate');
  }
  res.status(200).json({ success: true, data: certificate });
});

module.exports = { generateCertificate, getMyCertificates, verifyCertificate };
