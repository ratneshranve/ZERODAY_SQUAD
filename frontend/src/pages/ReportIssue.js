import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { AlertTriangle, MapPin, Calendar, Clock, Send, CheckCircle, Eye } from 'lucide-react';
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
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

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
        setErrors({ ...errors, location: '' });
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
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setPosition([lat, lng]);
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
    if (!date) newErrors.date = 'Please select a date';
    if (!time) newErrors.time = 'Please select a time';
    if (!locationName) newErrors.location = 'Please set your location';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    const timestamp = new Date(`${date}T${time}`).toISOString();

    try {
      await API.post('/reports', {
        lat: position[0],
        lng: position[1],
        issueType,
        timestamp
      });
      setIsSubmitted(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      const errorMessage = err.response?.data?.msg || 'Failed to submit report. Please try again.';
      setErrors({ submit: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const issueTypes = [
    { value: 'Foam', label: 'White Foam', description: 'Excessive foam on water surface', icon: '🧼' },
    { value: 'Dark water', label: 'Dark Water', description: 'Unusually dark or discolored water', icon: '💧' },
    { value: 'Bad smell', label: 'Bad Odor', description: 'Unpleasant smell from water', icon: '👃' },
    { value: 'Oil layer', label: 'Oil Layer', description: 'Visible oil or grease on surface', icon: '🛢️' }
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 relative" style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}>
        <div className="absolute inset-0 bg-green-50/30"></div>
        <div className="max-w-md w-full text-center relative z-10">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Report Submitted!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for helping keep Indore's water clean. Your report has been submitted and will be reviewed by our team.
            </p>
            <div className="text-sm text-gray-500">
              Redirecting to dashboard...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative" style={{
      backgroundImage: `url('https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      <div className="absolute inset-0 bg-white/10"></div>
      {/* Hero Section */}
      <div className="relative overflow-hidden z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 to-orange-900/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-white/10 backdrop-blur-sm rounded-full mb-6">
                <AlertTriangle className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                Report Pollution
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-300 to-orange-300">
                  Issue
                </span>
              </h1>
              <p className="text-xl text-red-100 max-w-3xl mx-auto">
                Help protect Indore's water resources by reporting pollution issues immediately
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="py-20 bg-white/50 backdrop-blur-sm relative" style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="absolute inset-0 bg-white/70"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Report Details</h2>
              <p className="text-gray-600">Please provide accurate information to help us respond effectively</p>
            </div>

            {/* Issue Type Selection */}
            <div className="mb-8">
              <label className="block text-lg font-semibold text-gray-900 mb-4">What type of pollution did you observe?</label>
              <div className="grid md:grid-cols-2 gap-4">
                {issueTypes.map((type) => (
                  <div
                    key={type.value}
                    onClick={() => setIssueType(type.value)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 ${
                      issueType === type.value
                        ? 'border-red-500 bg-red-50 shadow-lg'
                        : 'border-gray-200 hover:border-red-300 hover:bg-red-25'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{type.icon}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900">{type.label}</h3>
                        <p className="text-sm text-gray-600">{type.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Date and Time */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Date of Observation
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value);
                    setErrors({ ...errors, date: '' });
                  }}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 ${
                    errors.date ? 'border-red-300' : 'border-gray-300'
                  }`}
                  required
                />
                {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Time of Observation
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => {
                    setTime(e.target.value);
                    setErrors({ ...errors, time: '' });
                  }}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 ${
                    errors.time ? 'border-red-300' : 'border-gray-300'
                  }`}
                  required
                />
                {errors.time && <p className="mt-1 text-sm text-red-600">{errors.time}</p>}
              </div>
            </div>

            {/* Location Section */}
            <div className="mb-8">
              <label className="block text-lg font-semibold text-gray-900 mb-4">Location of the Issue</label>

              {/* Location Display */}
              {locationName && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 text-green-600 mr-3" />
                    <div>
                      <p className="font-medium text-green-800">Selected Location</p>
                      <p className="text-sm text-green-700">{locationName}</p>
                      <p className="text-xs text-green-600 mt-1">
                        Coordinates: {position[0].toFixed(4)}, {position[1].toFixed(4)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Get Location Button */}
              <button
                onClick={getLocation}
                className="mb-4 w-full md:w-auto bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 px-6 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-medium flex items-center justify-center"
              >
                <MapPin className="w-5 h-5 mr-2" />
                📍 Get Current Location
              </button>

              {errors.location && <p className="mb-4 text-sm text-red-600">{errors.location}</p>}

              {/* Map */}
              <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
                <MapContainer
                  center={position}
                  zoom={13}
                  style={{ height: '300px', width: '100%' }}
                  className="rounded-lg"
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <LocationMarker />
                </MapContainer>
              </div>
              <p className="text-xs text-gray-500 mt-2">Click on the map to set the exact location manually</p>
            </div>

            {/* Error Message */}
            {errors.submit && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{errors.submit}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white font-semibold py-4 px-6 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center text-lg"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                  Submitting Report...
                </>
              ) : (
                <>
                  <Send className="w-6 h-6 mr-3" />
                  Submit Pollution Report
                </>
              )}
            </button>

            {/* Info Note */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start">
                <Eye className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">Important Note</h4>
                  <p className="text-sm text-blue-800">
                    Your report will be reviewed by our team within 24 hours. If 5 or more reports are received
                    from the same area within 24 hours, it will trigger an automatic pollution alert.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportIssue;