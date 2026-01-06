import mongoose from "mongoose";

const alertSchema = new mongoose.Schema({
  gridId: String,
  affectedAt: Date,
  message: String,
  status: {
    type: String,
    default: "ACTIVE"
  }
}, { timestamps: true });

export default mongoose.model("Alert", alertSchema);
