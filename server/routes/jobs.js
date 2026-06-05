const express = require('express');
const router = express.Router();
const { getJobs, createJob, getJob, applyJob, getJobApplications } = require('../controllers/jobController');
const { protect, employerOnly, workerOnly } = require('../middleware/authMiddleware');

router.get('/', getJobs);
router.post('/', protect, employerOnly, createJob);
router.get('/:id', getJob);
router.post('/:id/apply', protect, workerOnly, applyJob);
router.get('/:id/applications', protect, employerOnly, getJobApplications);

module.exports = router;
