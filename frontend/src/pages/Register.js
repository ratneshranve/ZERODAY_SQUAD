import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { UserPlus, Mail, Phone, Lock, MapPin, Eye, EyeOff, CheckCircle } from 'lucide-react';
import API from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import 'leaflet/dist/leaflet.css';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', contact: '', password: '', lat: '', lng: '' });
  const [locationName, setLocationName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
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
        setErrors({ ...errors, location: '' });
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
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setForm({ ...form, lat, lng });
        const name = await getLocationName(lat, lng);
        setLocationName(name);
        setErrors({ ...errors, location: '' });
      }, (error) => {
        setErrors({ ...errors, location: 'Unable to get your location. Please allow location access or click on the map.' });
      });
    } else {
      setErrors({ ...errors, location: 'Geolocation is not supported by this browser.' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Email is invalid';
    if (!form.contact.trim()) newErrors.contact = 'Contact number is required';
    else if (!/^\d{10}$/.test(form.contact)) newErrors.contact = 'Contact must be 10 digits';
    if (!form.password) newErrors.password = 'Password is required';
    else if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!form.lat || !form.lng) newErrors.location = 'Please set your location';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const res = await API.post('/auth/register', form);
      login(res.data.token);
      navigate('/dashboard');
    } catch (err) {
      const errorMessage = err.response?.data?.msg || 'Registration failed. Please try again.';
      setErrors({ submit: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setForm({ ...form, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative" style={{
      backgroundImage: `url('https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      <div className="absolute inset-0 bg-white/20"></div>
      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mb-6">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Join Our Community</h2>
          <p className="text-gray-600">Create your account to help monitor water quality in Indore</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full pl-4 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  required
                />
              </div>
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  required
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            {/* Contact */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={form.contact}
                  onChange={(e) => handleInputChange('contact', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.contact ? 'border-red-300' : 'border-gray-300'
                  }`}
                  required
                />
              </div>
              {errors.contact && <p className="mt-1 text-sm text-red-600">{errors.contact}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  value={form.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            {/* Location Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Location</label>

              {/* Location Coordinates */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="relative">
                  <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    step="any"
                    placeholder="Latitude"
                    value={form.lat}
                    onChange={(e) => handleInputChange('lat', e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    step="any"
                    placeholder="Longitude"
                    value={form.lng}
                    onChange={(e) => handleInputChange('lng', e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Location Name */}
              {locationName && (
                <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    <span className="text-sm text-green-800">{locationName}</span>
                  </div>
                </div>
              )}

              {/* Get Location Button */}
              <button
                type="button"
                onClick={getLocation}
                className="w-full mb-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-2 px-4 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-sm font-medium"
              >
                📍 Get Current Location
              </button>

              {errors.location && <p className="mb-3 text-sm text-red-600">{errors.location}</p>}

              {/* Map */}
              <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
                <MapContainer
                  center={[22.7196, 75.8577]}
                  zoom={13}
                  style={{ height: '200px', width: '100%' }}
                  className="rounded-lg"
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <LocationMarker />
                </MapContainer>
              </div>
              <p className="text-xs text-gray-500 mt-2">Click on the map to set your location manually</p>
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{errors.submit}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold py-3 px-4 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating Account...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5 mr-2" />
                  Create Account
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;