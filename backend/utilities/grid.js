// Grid size: 500 meters
const GRID_SIZE = 500;

// Approximate meters per degree lat/lng (at Indore approx 22.7N)
const METERS_PER_DEG_LAT = 111320;
const METERS_PER_DEG_LNG = 111320 * Math.cos(22.7 * Math.PI / 180);

// Function to get grid ID from lat/lng
function getGridId(lat, lng) {
  // Indore center approx 22.7196, 75.8577
  const centerLat = 22.7196;
  const centerLng = 75.8577;

  const deltaLat = lat - centerLat;
  const deltaLng = lng - centerLng;

  const gridLat = Math.floor(deltaLat * METERS_PER_DEG_LAT / GRID_SIZE);
  const gridLng = Math.floor(deltaLng * METERS_PER_DEG_LNG / GRID_SIZE);

  return `${gridLat}_${gridLng}`;
}

// Function to get center of grid
function getGridCenter(gridId) {
  const [gridLat, gridLng] = gridId.split('_').map(Number);
  const centerLat = 22.7196 + (gridLat * GRID_SIZE) / METERS_PER_DEG_LAT;
  const centerLng = 75.8577 + (gridLng * GRID_SIZE) / METERS_PER_DEG_LNG;
  return { lat: centerLat, lng: centerLng };
}

// Function to get adjacent grids
function getAdjacentGrids(gridId) {
  const [gridLat, gridLng] = gridId.split('_').map(Number);
  const adjacent = [];
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue;
      adjacent.push(`${gridLat + i}_${gridLng + j}`);
    }
  }
  return adjacent;
}

module.exports = { getGridId, getGridCenter, getAdjacentGrids };