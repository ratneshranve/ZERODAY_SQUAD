import Report from "../models/Report.js";
import Alert from "../models/Alert.js";
import { getGridId } from "../utils/grid.util.js";
import { predictTime } from "../utils/timePrediction.util.js";

export const submitReport = async (req, res) => {
  const { lat, lng, problemType } = req.body;
  const gridId = getGridId(lat, lng);

  await Report.create({
    userId: req.user.id,
    problemType,
    location: { lat, lng },
    gridId
  });

  const count = await Report.countDocuments({
    gridId,
    createdAt: { $gte: new Date(Date.now() - 15 * 60 * 1000) }
  });

  if (count >= 5) {
    await Alert.create({
      gridId,
      affectedAt: predictTime(2),
      message: "Pollution may spread to nearby zones"
    });
  }

  res.json({ message: "Report submitted successfully" });
};
