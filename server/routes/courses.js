const express = require('express');
const router = express.Router();
const { getCourses, getCourse, enrollCourse, updateProgress } = require('../controllers/courseController');
const { protect, workerOnly } = require('../middleware/authMiddleware');

router.get('/', getCourses);
router.get('/:id', getCourse);
router.post('/:id/enroll', protect, workerOnly, enrollCourse);
router.patch('/:id/progress', protect, workerOnly, updateProgress);

module.exports = router;
