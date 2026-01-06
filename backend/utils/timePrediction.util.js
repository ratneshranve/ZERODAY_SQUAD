export const predictTime = (distanceKm, speedKmph = 1) => {
  const hours = distanceKm / speedKmph;
  return new Date(Date.now() + hours * 60 * 60 * 1000);
};
