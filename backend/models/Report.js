const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  gridId: { type: String, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
  issueType: { type: String, enum: ['Foam', 'Dark water', 'Bad smell', 'Oil layer'], required: true },
  status: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);