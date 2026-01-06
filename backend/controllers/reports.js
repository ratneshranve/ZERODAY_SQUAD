const Report = require('../models/Report');
const Alert = require('../models/Alert');
const { getGridId } = require('../utilities/grid');
const { predictSpread } = require('../utilities/prediction');

exports.submitReport = async (req, res) => {
  const { lat, lng, issueType, timestamp } = req.body;
  const userId = req.user.id;

  try {
    const gridId = getGridId(lat, lng);
    const report = new Report({ userId, gridId, lat, lng, issueType, timestamp: timestamp ? new Date(timestamp) : new Date() });
    await report.save();

    // Check for pollution in grid
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const reportsInGrid = await Report.find({
      gridId,
      timestamp: { $gte: twentyFourHoursAgo },
      status: 'pending'
    });

    if (reportsInGrid.length >= 5) {      console.log(`Pollution alert triggered for grid ${gridId}, reports: ${reportsInGrid.length}`);      // Mark grid as polluted
      const alert = new Alert({
        gridId,
        type: 'polluted',
        message: `Grid ${gridId} is polluted due to multiple reports. Immediate action required.`
      });
      await alert.save();

      // Predict spread
      const predictions = predictSpread(gridId);
      for (const pred of predictions) {
        const predAlert = new Alert({
          gridId: pred.gridId,
          type: 'predicted',
          impactTime: pred.impactTime,
          message: `Predicted pollution in grid ${pred.gridId} in ${pred.timeHours.toFixed(1)} hours. Prepare precautions.`
        });
        await predAlert.save();
      }
    }

    res.json({ msg: 'Report submitted' });
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.getReports = async (req, res) => {
  try {
    const reports = await Report.find().populate('userId', 'name');
    res.json(reports);
  } catch (err) {
    res.status(500).send('Server error');
  }
};