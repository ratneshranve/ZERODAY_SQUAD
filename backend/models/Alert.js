const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  gridId: { type: String, required: true },
  type: { type: String, enum: ['polluted', 'predicted'], required: true },
  impactTime: { type: Date },
  message: { type: String, required: true },
  sent: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Alert', alertSchema);