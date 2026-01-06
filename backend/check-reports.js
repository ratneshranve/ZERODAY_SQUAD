const mongoose = require('mongoose');
const Report = require('./models/Report');

mongoose.connect('mongodb://localhost:27017/indore-pollution', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(async () => {
    console.log('Connected to MongoDB');
    const reports = await Report.find({});
    console.log('Total reports:', reports.length);
    reports.forEach((r, i) => {
      console.log(`Report ${i+1}: ID=${r._id}, UserId=${r.userId}, Status=${r.status}, Grid=${r.gridId}`);
    });
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });