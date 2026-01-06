const Report = require('../models/Report');
const Alert = require('../models/Alert');
const User = require('../models/User');

exports.verifyReport = async (req, res) => {
  const { reportId, status } = req.body;

  try {
    const report = await Report.findById(reportId);
    if (!report) return res.status(404).json({ msg: 'Report not found' });

    report.status = status;
    await report.save();

    res.json({ msg: 'Report updated' });
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ createdAt: -1 });
    res.json(alerts);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Exclude password for security
    res.json(users);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.sendUserAlert = async (req, res) => {
  const { alertId } = req.body;

  try {
    const alert = await Alert.findById(alertId);
    if (!alert) return res.status(404).json({ msg: 'Alert not found' });

    // In real app, send notifications to users in affected grid
    // For now, just mark as sent
    alert.sent = true;
    await alert.save();

    // Update message for user alert
    if (alert.type === 'predicted') {
      alert.message = `आपके क्षेत्र में ${alert.impactTime ? new Date(alert.impactTime).toLocaleString() : 'जल्दी'} गंदा पानी आने वाला है। कृपया सुरक्षित पानी स्टोर करें। (Polluted water may reach your area soon. Please store safe water.)`;
    } else if (alert.type === 'polluted') {
      alert.message = `आपके क्षेत्र में पानी प्रदूषित है। पीने से बचें और अधिकारियों से संपर्क करें। (Water in your area is polluted. Avoid drinking and contact authorities.)`;
    }

    res.json({ msg: 'Alert sent to users' });
  } catch (err) {
    res.status(500).send('Server error');
  }
};