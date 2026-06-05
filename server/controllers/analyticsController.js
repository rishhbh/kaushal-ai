const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Employer = require('../models/Employer');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Course = require('../models/Course');
const Certificate = require('../models/Certificate');

// @desc    Get platform stats
// @route   GET /api/analytics/platform
const getPlatformAnalytics = asyncHandler(async (req, res) => {
  const totalWorkers = await User.countDocuments();
  const totalEmployers = await Employer.countDocuments();
  const totalJobs = await Job.countDocuments();
  const totalApplications = await Application.countDocuments();
  const totalCertificates = await Certificate.countDocuments();

  // Workers by trade
  const workersByTrade = await User.aggregate([
    { $group: { _id: "$trade", count: { $sum: 1 } } }
  ]);

  // Skill levels
  const skillLevels = await User.aggregate([
    { $group: { _id: "$skillLevel", count: { $sum: 1 } } }
  ]);

  res.status(200).json({
    success: true,
    data: {
      totalWorkers,
      totalEmployers,
      totalJobs,
      totalApplications,
      totalCertificates,
      workersByTrade,
      skillLevels
    }
  });
});

// @desc    Get employer stats
// @route   GET /api/analytics/employer
const getEmployerAnalytics = asyncHandler(async (req, res) => {
  const employerId = req.user._id;

  const totalJobs = await Job.countDocuments({ employerId });
  const totalApplications = await Application.countDocuments({ employerId });
  const hiredApplications = await Application.countDocuments({ employerId, status: 'Hired' });
  
  const applicationsByStatus = await Application.aggregate([
    { $match: { employerId: employerId } },
    { $group: { _id: "$status", count: { $sum: 1 } } }
  ]);

  res.status(200).json({
    success: true,
    data: {
      totalJobs,
      totalApplications,
      hiredApplications,
      applicationsByStatus
    }
  });
});

module.exports = { getPlatformAnalytics, getEmployerAnalytics };
