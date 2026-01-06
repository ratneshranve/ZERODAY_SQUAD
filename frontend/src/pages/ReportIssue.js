import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import API from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import 'leaflet/dist/leaflet.css';

const ReportIssue = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [position, setPosition] = useState([22.7196, 75.8577]); // Indore center
  const [issueType, setIssueType] = useState('Foam');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [locationName, setLocationName] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.role === 'admin') {
      navigate('/admin');
    }
  }, [user, navigate]);

  const LocationMarker = () => {
    useMapEvents({
      click: async (e) => {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        setPosition([lat, lng]);
        const name = await getLocationName(lat, lng);
        setLocationName(name);
      },
    });

    return <Marker position={position}></Marker>;
  };

  const getLocationName = async (lat, lng) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await response.json();
      return data.display_name || 'Unknown Location';
    } catch (error) {
      console.error('Error fetching location name:', error);
      return 'Unknown Location';
    }
  };

  const getLocation = async () => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      setPosition([lat, lng]);
      const name = await getLocationName(lat, lng);
      setLocationName(name);
    });
  };

  const handleSubmit = async () => {
    if (!date || !time) {
      alert('Please select both date and time');
      return;
    }
    const timestamp = new Date(`${date}T${time}`).toISOString();
    try {
      await API.post('/reports', {
        lat: position[0],
        lng: position[1],
        issueType,
        timestamp
      });
      alert('Report submitted');
    } catch (err) {
      alert('Failed to submit report');
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Report Water Pollution Issue</h1>
      <div className="mb-4">
        <label className="block mb-2">Issue Type:</label>
        <select value={issueType} onChange={(e) => setIssueType(e.target.value)} className="p-2 border rounded">
          <option>Foam</option>
          <option>Dark water</option>
          <option>Bad smell</option>
          <option>Oil layer</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-2">Date:</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="p-2 border rounded" required />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Time:</label>
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="p-2 border rounded" required />
      </div>
      <div className="mb-4">
        <p className="mb-2">Click on the map to set the location:</p>
        <MapContainer center={position} zoom={13} style={{ height: '400px' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <LocationMarker />
        </MapContainer>
        <button onClick={getLocation} className="mt-2 bg-blue-500 text-white p-2 rounded">Get Current Location</button>
        {locationName && <p className="mt-2 text-green-600">Location: {locationName}</p>}
      </div>
      <button onClick={handleSubmit} className="bg-red-500 text-white p-2 rounded">Submit Report</button>
    </div>
  );
};

export default ReportIssue;