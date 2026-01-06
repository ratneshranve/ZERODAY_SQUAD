import React from 'react';

const Home = () => {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold text-center mb-8">Indore Smart Water Pollution Detection & Alert System</h1>
      <p className="text-lg text-center mb-8">
        Monitor water pollution in Indore city using real location data, user reports, and AI-assisted detection.
      </p>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-bold mb-4">Real-time Monitoring</h2>
          <p>Track water quality across Indore with live data and alerts.</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-bold mb-4">User Reports</h2>
          <p>Citizens can report pollution issues directly through the app.</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-bold mb-4">AI Prediction</h2>
          <p>Advanced algorithms predict pollution spread and alert authorities.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;