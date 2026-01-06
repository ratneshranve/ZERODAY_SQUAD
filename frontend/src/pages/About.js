import React from 'react';

const About = () => {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">About the System</h1>
      <p className="mb-4">
        The Indore Smart Water Pollution Detection & Alert System is designed to protect citizens from polluted water by providing early warnings and real-time monitoring.
      </p>
      <p className="mb-4">
        Using a combination of user reports, grid-based analysis, and physics-based prediction models, the system identifies polluted areas and predicts the spread of contamination.
      </p>
      <p>
        Authorities receive immediate alerts, while citizens are notified before polluted water reaches their location.
      </p>
    </div>
  );
};

export default About;