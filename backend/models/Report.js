import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  problemType: {
    type: String,
    enum: ["foam", "dark_water", "bad_smell", "oil"]
  },
  location: {
    lat: Number,
    lng: Number
  },
  gridId: String
}, { timestamps: true });

export default mongoose.model("Report", reportSchema);
