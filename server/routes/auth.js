const express = require('express');
const router = express.Router();
const { registerWorker, registerEmployer, login, logout, getMe, updateLanguage, skipAssessment } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register/worker', registerWorker);
router.post('/register/employer', registerEmployer);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.patch('/language', protect, updateLanguage);
router.patch('/skip-assessment', protect, skipAssessment);

module.exports = router;
