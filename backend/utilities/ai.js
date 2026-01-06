// Rule-based classification for water quality
function classifyWaterQuality(ph, turbidity, tds, conductivity) {
  let score = 0;

  // pH: ideal 6.5-8.5
  if (ph < 6.5 || ph > 8.5) score += 2;
  else if (ph < 7 || ph > 8) score += 1;

  // Turbidity: <5 NTU safe
  if (turbidity > 5) score += 2;
  else if (turbidity > 1) score += 1;

  // TDS: <500 mg/L safe
  if (tds > 500) score += 2;
  else if (tds > 300) score += 1;

  // Conductivity: <800 μS/cm safe
  if (conductivity > 800) score += 2;
  else if (conductivity > 500) score += 1;

  if (score <= 2) return 'Safe';
  else if (score <= 5) return 'Moderately Polluted';
  else return 'Highly Polluted';
}

module.exports = { classifyWaterQuality };