const express = require('express');
const router = express.Router();
const { assessSkills, answerDoubt, generateResume, analyzeResume, generateJd, checkJobFit } = require('../controllers/aiController');
const { protect, workerOnly, employerOnly } = require('../middleware/authMiddleware');

router.post('/assess', protect, workerOnly, assessSkills);
router.post('/doubt', protect, workerOnly, answerDoubt);
router.post('/generate-resume', protect, workerOnly, generateResume);
router.post('/analyze-resume', protect, workerOnly, analyzeResume);
router.post('/generate-jd', protect, employerOnly, generateJd);
router.post('/job-fit', protect, workerOnly, checkJobFit);

module.exports = router;
