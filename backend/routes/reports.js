const express = require('express');
const { submitReport, getReports } = require('../controllers/reports');
const { auth } = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, submitReport);
router.get('/', auth, getReports);

module.exports = router;