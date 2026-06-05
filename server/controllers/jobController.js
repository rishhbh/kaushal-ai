const asyncHandler = require('express-async-handler');
const Job = require('../models/Job');
const Application = require('../models/Application');

// @desc    Get all active jobs
// @route   GET /api/jobs
const getJobs = asyncHandler(async (req, res) => {
  const { trade, location, level } = req.query;
  const filter = { isActive: true };
  if (trade) filter.trade = trade;
  if (location) filter.location = new RegExp(location, 'i');
  if (level) filter.level = level;

  const jobs = await Job.find(filter).sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: jobs.length, data: jobs });
});

// @desc    Create a job
// @route   POST /api/jobs
const createJob = asyncHandler(async (req, res) => {
  req.body.employerId = req.user._id;
  req.body.companyName = req.user.companyName;

  const job = await Job.create(req.body);
  
  req.user.postedJobs.push(job._id);
  await req.user.save();

  res.status(201).json({ success: true, data: job });
});

// @desc    Get single job
// @route   GET /api/jobs/:id
const getJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    res.status(404); throw new Error('Job not found');
  }
  res.status(200).json({ success: true, data: job });
});

// @desc    Apply for a job
// @route   POST /api/jobs/:id/apply
const applyJob = asyncHandler(async (req, res) => {
  const jobId = req.params.id;
  const userId = req.user._id;

  const job = await Job.findById(jobId);
  if (!job) {
    res.status(404); throw new Error('Job not found');
  }

  const existingApplication = await Application.findOne({ userId, jobId });
  if (existingApplication) {
    res.status(400); throw new Error('Already applied to this job');
  }

  const application = await Application.create({
    userId,
    jobId,
    employerId: job.employerId
  });

  res.status(201).json({ success: true, data: application });
});

// @desc    Update application status
// @route   PATCH /api/applications/:id/status
const updateApplicationStatus = asyncHandler(async (req, res) => {
  const applicationId = req.params.id;
  const { status } = req.body;

  const application = await Application.findById(applicationId);
  if (!application) {
    res.status(404); throw new Error('Application not found');
  }

  // Ensure employer owns this application
  if (application.employerId.toString() !== req.user._id.toString()) {
    res.status(403); throw new Error('Not authorized to update this application');
  }

  application.status = status;
  application.updatedAt = Date.now();
  await application.save();

  res.status(200).json({ success: true, data: application });
});

// @desc    Get applications for a job (Employer)
// @route   GET /api/jobs/:id/applications
const getJobApplications = asyncHandler(async (req, res) => {
  const jobId = req.params.id;
  const applications = await Application.find({ jobId, employerId: req.user._id }).populate('userId', '-passwordHash');
  
  res.status(200).json({ success: true, count: applications.length, data: applications });
});

module.exports = { getJobs, createJob, getJob, applyJob, updateApplicationStatus, getJobApplications };
