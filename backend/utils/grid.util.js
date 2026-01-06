export const getGridId = (lat, lng) => {
  const size = 0.005; // ≈ 500m
  const x = Math.floor(lat / size);
  const y = Math.floor(lng / size);
  return `${x}_${y}`;
};
