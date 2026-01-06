const express = require('express');
const { verifyReport, getAlerts, sendUserAlert, getUsers } = require('../controllers/admin');
const { auth, adminAuth } = require('../middleware/auth');
const router = express.Router();

router.put('/verify-report', auth, adminAuth, verifyReport);
router.get('/alerts', auth, adminAuth, getAlerts);
router.post('/send-alert', auth, adminAuth, sendUserAlert);
router.get('/users', auth, adminAuth, getUsers);

module.exports = router;