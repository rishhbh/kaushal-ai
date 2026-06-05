const express = require('express');
const router = express.Router();
const { generateCertificate, getMyCertificates, verifyCertificate } = require('../controllers/certificateController');
const { protect, workerOnly } = require('../middleware/authMiddleware');

router.post('/generate', protect, workerOnly, generateCertificate);
router.get('/my', protect, workerOnly, getMyCertificates);
router.get('/:certUUID', verifyCertificate);

module.exports = router;
