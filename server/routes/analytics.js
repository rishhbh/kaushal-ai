const express = require('express');
const router = express.Router();
const { getPlatformAnalytics, getEmployerAnalytics } = require('../controllers/analyticsController');
const { protect, employerOnly } = require('../middleware/authMiddleware');

router.get('/platform', getPlatformAnalytics);
router.get('/employer', protect, employerOnly, getEmployerAnalytics);

module.exports = router;
