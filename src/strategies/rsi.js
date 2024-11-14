function calculateRSI(data, period = 14) {
  const changes = data.slice(1).map((price, index) => price - data[index]);
  const gains = changes.map(change => change > 0 ? change : 0);
  const losses = changes.map(change => change < 0 ? -change : 0);

  let avgGain = gains.slice(0, period).reduce((a, b) => a + b) / period;
  let avgLoss = losses.slice(0, period).reduce((a, b) => a + b) / period;

  let rs = avgGain / avgLoss;
  const rsiPeriod = [100 - (100 / (1 + rs))];

  for (let i = period; i < data.length - 1; i++) {
    const gain = gains[i];
    const loss = losses[i];

    avgGain = ((avgGain * (period - 1)) + gain) / period;
    avgLoss = ((avgLoss * (period - 1)) + loss) / period;

    rs = avgGain / avgLoss;
    rsiPeriod.push(100 - (100 / (1 + rs)));
  }

  return Array(period).fill(null).concat(rsiPeriod);
}

module.exports = { calculateRSI };