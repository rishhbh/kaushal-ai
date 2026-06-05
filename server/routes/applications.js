const express = require('express');
const router = express.Router();
const { updateApplicationStatus } = require('../controllers/jobController');
const { protect, employerOnly } = require('../middleware/authMiddleware');

router.patch('/:id/status', protect, employerOnly, updateApplicationStatus);

module.exports = router;
