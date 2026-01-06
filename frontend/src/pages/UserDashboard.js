import React, { useState, useEffect, useContext } from 'react';
import API from '../services/api';
import { AuthContext } from '../contexts/AuthContext';

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const [alerts, setAlerts] = useState([]);
  const [userReports, setUserReports] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('User object:', user);
        console.log('User ID:', user?.id);
        console.log('Is user logged in:', !!user);
        const alertsRes = await API.get('/auth/alerts');
        setAlerts(alertsRes.data);

        const reportsRes = await API.get('/reports');
        console.log('All reports:', reportsRes.data);
        console.log('Current user ID:', user.id);
        // Filter reports for current user
        const myReports = reportsRes.data.filter(r => {
          // Handle both populated user object and ObjectId string
          const reportUserId = r.userId?._id || r.userId;
          console.log('Comparing report userId:', reportUserId, 'with user.id:', user.id);
          return reportUserId === user.id; // Use strict equality for string/ObjectId comparison
        });
        console.log('Filtered reports for user:', myReports);
        setUserReports(myReports);
      } catch (err) {
        console.error(err);
      }
    };
    if (user) fetchData();
  }, [user]);

  const pendingCount = userReports.filter(r => r.status === 'pending').length;
  const verifiedCount = userReports.filter(r => r.status === 'verified').length;
  const rejectedCount = userReports.filter(r => r.status === 'rejected').length;

  return (
    <div className="container mx-auto p-8 relative" style={{
      backgroundImage: `url('https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      minHeight: '100vh'
    }}>
      <div className="absolute inset-0 bg-white/10"></div>
      <div className="relative z-10">
      <h1 className="text-3xl font-bold mb-6">User Dashboard</h1>
      <p>Welcome, {user ? 'User' : 'Guest'}!</p>
      
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Your Report Summary</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-yellow-100 p-4 rounded">
            <h3 className="text-lg font-semibold">Pending Reports</h3>
            <p className="text-2xl">{pendingCount}</p>
          </div>
          <div className="bg-green-100 p-4 rounded">
            <h3 className="text-lg font-semibold">Verified Reports</h3>
            <p className="text-2xl">{verifiedCount}</p>
          </div>
          <div className="bg-red-100 p-4 rounded">
            <h3 className="text-lg font-semibold">Rejected Reports</h3>
            <p className="text-2xl">{rejectedCount}</p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Your Reports</h2>
        {userReports.length === 0 ? (
          <p>You haven't submitted any reports yet.</p>
        ) : (
          <div className="space-y-4">
            {userReports.map((report) => (
              <div key={report._id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-4 mb-2">
                      <span className="text-sm text-gray-500">
                        {new Date(report.timestamp).toLocaleString()}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        report.status === 'verified' ? 'bg-green-100 text-green-800' :
                        report.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>Issue:</strong> {report.issueType}</p>
                      <p><strong>Location:</strong> {report.lat.toFixed(4)}, {report.lng.toFixed(4)}</p>
                      <p><strong>Grid ID:</strong> {report.gridId}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Recent Alerts</h2>
        {alerts.length === 0 ? (
          <p>No alerts at this time.</p>
        ) : (
          <ul>
            {alerts.map((alert, index) => (
              <li key={index} className="mb-2 p-2 bg-yellow-100 rounded">
                {alert.message}
              </li>
            ))}
          </ul>
        )}
      </div>
      </div>
    </div>
  );
};

export default UserDashboard;