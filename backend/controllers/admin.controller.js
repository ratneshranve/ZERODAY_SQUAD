import Report from "../models/Report.js";
import Alert from "../models/Alert.js";

export const getDashboard = async (req, res) => {
  const reports = await Report.find();
  const alerts = await Alert.find();
  res.json({ reports, alerts });
};
// export const getMapData = async (req, res) => {
//   const reports = await Report.find();
//   const alerts = await Alert.find({ status: "ACTIVE" });

//   res.json({
//     pollutedPoints: reports.map(r => ({
//       lat: r.location.lat,
//       lng: r.location.lng,
//       gridId: r.gridId,
//       problemType: r.problemType
//     })),
//     redZones: alerts.map(a => ({
//       gridId: a.gridId,
//       affectedAt: a.affectedAt
//     }))
//   });
// };
