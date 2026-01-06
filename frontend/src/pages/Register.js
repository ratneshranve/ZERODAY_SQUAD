import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import API from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import 'leaflet/dist/leaflet.css';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', contact: '', password: '', lat: '', lng: '' });
  const [locationName, setLocationName] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const LocationMarker = () => {
    useMapEvents({
      click: async (e) => {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        setForm({ ...form, lat, lng });
        const name = await getLocationName(lat, lng);
        setLocationName(name);
      },
    });

    return form.lat && form.lng ? <Marker position={[form.lat, form.lng]}></Marker> : null;
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
      setForm({ ...form, lat, lng });
      const name = await getLocationName(lat, lng);
      setLocationName(name);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Basic validation
    if (form.password.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }
    if (!/^\d{10}$/.test(form.contact)) {
      alert('Contact must be 10 digits');
      return;
    }
    try {
      const res = await API.post('/auth/register', form);
      login(res.data.token);
      navigate('/dashboard');
    } catch (err) {
      alert('Registration failed');
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Register</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Full Name (e.g., John Doe)"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full p-2 border rounded"
            required
            minLength="2"
          />
        </div>
        <div>
          <input
            type="email"
            placeholder="Email (e.g., john@example.com)"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <input
            type="tel"
            placeholder="Contact (10 digits, e.g., 9876543210)"
            value={form.contact}
            onChange={(e) => setForm({ ...form, contact: e.target.value })}
            className="w-full p-2 border rounded"
            required
            pattern="[0-9]{10}"
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password (min 6 characters)"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full p-2 border rounded"
            required
            minLength="6"
          />
        </div>
        <div className="flex space-x-2">
          <input
            type="number"
            step="any"
            placeholder="Latitude (e.g., 22.7196)"
            value={form.lat}
            onChange={(e) => setForm({ ...form, lat: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="number"
            step="any"
            placeholder="Longitude (e.g., 75.8577)"
            value={form.lng}
            onChange={(e) => setForm({ ...form, lng: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button type="button" onClick={getLocation} className="w-full bg-blue-500 text-white p-2 rounded">Get Current Location</button>
        {locationName && <p className="text-center text-green-600">Location: {locationName}</p>}
        <div className="mb-4">
          <p className="mb-2">Click on the map to set your location:</p>
          <MapContainer center={[22.7196, 75.8577]} zoom={13} style={{ height: '300px' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationMarker />
          </MapContainer>
        </div>
        <button type="submit" className="w-full bg-green-500 text-white p-2 rounded">Register</button>
      </form>
    </div>
  );
};

export default Register;