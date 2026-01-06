import React, { useState, useEffect, useContext } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, Circle } from "react-leaflet";
import {
  ShieldAlert,
  MapPin,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileCheck
} from "lucide-react";
import API from "../services/api";
import { AuthContext } from "../contexts/AuthContext";
import "leaflet/dist/leaflet.css";

/* ---------- GRID UTILS ---------- */
const GRID_SIZE = 500;
const METERS_PER_DEG_LAT = 111320;
const METERS_PER_DEG_LNG = 111320 * Math.cos(22.7 * Math.PI / 180);

const getGridCenter = (gridId) => {
  const [x, y] = gridId.split("_").map(Number);
  return {
    lat: 22.7196 + (x * GRID_SIZE) / METERS_PER_DEG_LAT,
    lng: 75.8577 + (y * GRID_SIZE) / METERS_PER_DEG_LNG
  };
};

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);

  const [reports, setReports] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("alerts");

  /* ---------- LOAD DATA ---------- */
  useEffect(() => {
    if (!user || user.role !== "admin") return;

    const loadData = async () => {
      const reportsRes = await API.get("/reports");
      const alertsRes = await API.get("/admin/alerts");
      const usersRes = await API.get("/admin/users");

      setReports(reportsRes.data);
      setAlerts(alertsRes.data);
      setUsers(usersRes.data.filter(u => u.role === "user"));
    };

    loadData();
  }, [user]);

  /* ---------- ACTIONS ---------- */
  const verifyReport = async (id, status) => {
    await API.put("/admin/verify-report", { reportId: id, status });
    setReports(prev =>
      prev.map(r => (r._id === id ? { ...r, status } : r))
    );
  };

  const sendAlert = async (id) => {
    await API.post("/admin/send-alert", { alertId: id });
    setAlerts(prev => prev.filter(a => a._id !== id));
    alert("Alert sent successfully");
  };

  /* ---------- UI ---------- */
  return (
    <div
      className="min-h-screen relative"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed"
      }}
    >
      <div className="absolute inset-0 bg-black/30"></div>

      {/* ---------- HERO ---------- */}
      <div className="relative z-10 pt-20 pb-12 text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-white/10 backdrop-blur rounded-full mb-6">
          <ShieldAlert className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-5xl font-bold text-white mb-4 drop-shadow">
          Admin Control Center
        </h1>
        <p className="text-lg text-white/90 max-w-3xl mx-auto">
          Monitor, verify, and prevent polluted water spread across Indore
        </p>
      </div>

      {/* ---------- CONTENT ---------- */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-20">

        {/* ---------- TABS ---------- */}
        <div className="flex flex-wrap gap-3 mb-8">
          {[
            { id: "alerts", label: "Alerts", icon: AlertTriangle },
            { id: "pending", label: "Pending Reports", icon: Clock },
            { id: "verified", label: "Verified Reports", icon: FileCheck },
            { id: "users", label: "Users", icon: Users }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition ${
                activeTab === tab.id
                  ? "bg-red-600 text-white"
                  : "bg-white/80 hover:bg-white"
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* ---------- MAP (ALWAYS VISIBLE) ---------- */}
        <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl p-6 mb-10">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-red-600" />
            Live Pollution Map
          </h2>

          <MapContainer center={[22.7196, 75.8577]} zoom={12} style={{ height: 420 }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {reports.map(r => (
              <CircleMarker
                key={r._id}
                center={[r.lat, r.lng]}
                radius={8}
                color={r.status === "verified" ? "green" : "red"}
                fillOpacity={0.8}
              >
                <Popup>{r.issueType} ({r.status})</Popup>
              </CircleMarker>
            ))}

            {alerts.map(a => {
              const c = getGridCenter(a.gridId);
              return (
                <Circle
                  key={a._id}
                  center={[c.lat, c.lng]}
                  radius={250}
                  color={a.type === "predicted" ? "orange" : "red"}
                  fillOpacity={0.3}
                >
                  <Popup>{a.message}</Popup>
                </Circle>
              );
            })}
          </MapContainer>
        </div>

        {/* ---------- TAB CONTENT ---------- */}
        {activeTab === "alerts" && (
          <div className="space-y-4">
            {alerts.map(a => (
              <div key={a._id} className="bg-red-50 border p-4 rounded-lg">
                <p className="font-medium text-red-800">{a.message}</p>
                <p className="text-sm text-gray-600">
                  Affect time: {new Date(a.affectedAt).toLocaleString()}
                </p>
                {!a.sent && (
                  <button
                    onClick={() => sendAlert(a._id)}
                    className="mt-2 bg-red-600 text-white px-4 py-1 rounded"
                  >
                    Send Alert
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === "pending" && reports
          .filter(r => r.status === "pending")
          .map(r => (
            <div key={r._id} className="bg-yellow-50 border p-4 rounded-lg mb-3 flex justify-between">
              <div>
                <p className="font-medium">{r.issueType}</p>
                <p className="text-sm text-gray-600">
                  {r.lat.toFixed(4)}, {r.lng.toFixed(4)}
                </p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => verifyReport(r._id, "verified")}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  Verify
                </button>
                <button
                  onClick={() => verifyReport(r._id, "rejected")}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}

        {activeTab === "verified" && reports
          .filter(r => r.status === "verified")
          .map(r => (
            <div key={r._id} className="bg-green-50 border p-4 rounded-lg mb-3">
              {r.issueType} – Verified
            </div>
          ))}

        {activeTab === "users" && users.map(u => (
          <div key={u._id} className="bg-blue-50 border p-4 rounded-lg mb-3">
            {u.name} — {u.email}
          </div>
        ))}

      </div>
    </div>
  );
};

export default AdminDashboard;
