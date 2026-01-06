const { getAdjacentGrids, getGridCenter } = require('./grid');

// Water flow speed in m/s (assume 0.5 m/s for rivers)
const FLOW_SPEED = 0.5;

// Function to calculate distance between two points (Haversine)
function getDistance(lat1, lng1, lat2, lng2) {
  const R = 6371000; // Earth radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Predict spread from polluted grid
function predictSpread(pollutedGridId) {
  const adjacent = getAdjacentGrids(pollutedGridId);
  const predictions = [];

  const pollutedCenter = getGridCenter(pollutedGridId);

  adjacent.forEach(adjGridId => {
    const adjCenter = getGridCenter(adjGridId);
    const distance = getDistance(pollutedCenter.lat, pollutedCenter.lng, adjCenter.lat, adjCenter.lng);
    const timeHours = distance / FLOW_SPEED / 3600; // in hours
    // Set impact time to 24 hours from now
    const impactTime = new Date(Date.now() + 24 * 60 * 60 * 1000);
    predictions.push({
      gridId: adjGridId,
      distance: distance,
      impactTime: impactTime,
      timeHours: timeHours
    });
  });

  return predictions;
}

module.exports = { predictSpread };