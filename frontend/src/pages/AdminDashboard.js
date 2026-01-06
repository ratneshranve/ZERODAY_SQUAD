import React, { useState, useEffect, useContext } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Circle } from 'react-leaflet';
import API from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import 'leaflet/dist/leaflet.css';

// Grid utilities
const GRID_SIZE = 500;
const METERS_PER_DEG_LAT = 111320;
const METERS_PER_DEG_LNG = 111320 * Math.cos(22.7 * Math.PI / 180);

const getGridCenter = (gridId) => {
  const [gridLat, gridLng] = gridId.split('_').map(Number);
  const centerLat = 22.7196 + (gridLat * GRID_SIZE) / METERS_PER_DEG_LAT;
  const centerLng = 75.8577 + (gridLng * GRID_SIZE) / METERS_PER_DEG_LNG;
  return { lat: centerLat, lng: centerLng };
};

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [reports, setReports] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [users, setUsers] = useState([]);
  const [pollutedGrids, setPollutedGrids] = useState([]);
  const [activeTab, setActiveTab] = useState('alerts');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reportsRes = await API.get('/reports');
        setReports(reportsRes.data);
        const alertsRes = await API.get('/admin/alerts');
        setAlerts(alertsRes.data);
        const usersRes = await API.get('/admin/users');
        setUsers(usersRes.data.filter(u => u.role === 'user'));

        // Get polluted grids (grids with 5+ reports in last 15 min)
        const fifteenMinAgo = new Date(Date.now() - 15 * 60 * 1000);
        const recentReports = reportsRes.data.filter(r => new Date(r.timestamp) >= fifteenMinAgo && r.status === 'pending');
        const gridCounts = {};
        recentReports.forEach(r => {
          gridCounts[r.gridId] = (gridCounts[r.gridId] || 0) + 1;
        });
        const polluted = Object.keys(gridCounts).filter(gridId => gridCounts[gridId] >= 5);
        setPollutedGrids(polluted);
      } catch (err) {
        console.error(err);
      }
    };
    if (user && user.role === 'admin') fetchData();
  }, [user]);

  // Auto-refresh alerts every 30 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const alertsRes = await API.get('/admin/alerts');
        setAlerts(alertsRes.data);
      } catch (err) {
        console.error(err);
      }
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const verifyReport = async (reportId, status) => {
    try {
      await API.put('/admin/verify-report', { reportId, status });
      setReports(reports.map(r => r._id === reportId ? { ...r, status } : r));
    } catch (err) {
      alert('Failed to verify report');
    }
  };

  const sendAlert = async (alertId) => {
    try {
      await API.post('/admin/send-alert', { alertId });
      alert('Alert sent');
    } catch (err) {
      alert('Failed to send alert');
    }
  };

  return (
    <>
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Map View</h2>
          <MapContainer center={[22.7196, 75.8577]} zoom={12} style={{ height: '400px' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {reports.filter(r => r.status === 'pending').map(report => (
              <CircleMarker key={report._id} center={[report.lat, report.lng]} radius={8} color="red" fillColor="red" fillOpacity={0.8}>
                <Popup>{report.issueType} - Pending</Popup>
              </CircleMarker>
            ))}
            {reports.filter(r => r.status === 'verified').map(report => (
              <CircleMarker key={report._id} center={[report.lat, report.lng]} radius={8} color="green" fillColor="green" fillOpacity={0.8}>
                <Popup>{report.issueType} - Verified</Popup>
              </CircleMarker>
            ))}
            {alerts.filter(a => a.type === 'polluted').map(alert => {
              const center = getGridCenter(alert.gridId);
              return (
                <Circle key={alert._id} center={[center.lat, center.lng]} radius={250} color="red" fillColor="red" fillOpacity={0.3}>
                  <Popup>Grid {alert.gridId} - Polluted</Popup>
                </Circle>
              );
            })}
            {alerts.filter(a => a.type === 'predicted').map(alert => {
              const center = getGridCenter(alert.gridId);
              return (
                <Circle key={alert._id} center={[center.lat, center.lng]} radius={250} color="yellow" fillColor="yellow" fillOpacity={0.3}>
                  <Popup>Grid {alert.gridId} - Predicted Pollution</Popup>
                </Circle>
              );
            })}
          </MapContainer>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Alerts</h2>
          <ul>
            {alerts.map(alert => (
              <li key={alert._id} className="mb-2 p-2 bg-gray-100 rounded">
                {alert.message}
                {!alert.sent && (
                  <button onClick={() => sendAlert(alert._id)} className="ml-2 bg-blue-500 text-white p-1 rounded">Send Alert</button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-8">
        <div className="flex space-x-4 mb-4">
          <button onClick={() => setActiveTab('pending')} className={`p-2 rounded ${activeTab === 'pending' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Pending Reports</button>
          <button onClick={() => setActiveTab('verified')} className={`p-2 rounded ${activeTab === 'verified' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Verified Reports</button>
          <button onClick={() => setActiveTab('users')} className={`p-2 rounded ${activeTab === 'users' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Users</button>
        </div>
        {activeTab === 'pending' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Pending Reports</h2>
            <ul>
              {reports.filter(r => r.status === 'pending').map(report => (
                <li key={report._id} className="mb-2 p-2 bg-yellow-100 rounded">
                  {report.issueType} at {report.lat}, {report.lng}
                  <button onClick={() => verifyReport(report._id, 'verified')} className="ml-2 bg-green-500 text-white p-1 rounded">Verify</button>
                  <button onClick={() => verifyReport(report._id, 'rejected')} className="ml-2 bg-red-500 text-white p-1 rounded">Reject</button>
                </li>
              ))}
            </ul>
          </div>
        )}
        {activeTab === 'verified' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Verified Reports</h2>
            <ul>
              {reports.filter(r => r.status === 'verified').map(report => (
                <li key={report._id} className="mb-2 p-2 bg-green-100 rounded">
                  {report.issueType} at {report.lat}, {report.lng} - Verified
                </li>
              ))}
            </ul>
          </div>
        )}
        {activeTab === 'users' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Registered Users</h2>
            <ul>
              {users.map(user => (
                <li key={user._id} className="mb-2 p-2 bg-blue-100 rounded">
                  {user.name} - {user.email} - {user.contact}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
    </div>
    </>
  );
};

export default AdminDashboard;