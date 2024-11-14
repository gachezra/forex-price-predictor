const { movingAverage } = require('../strategies/movingAverage');
const { calculateRSI } = require('../strategies/rsi');
const { calculateMACD } = require('../strategies/macd');
const { calculateWyckoff } = require('../strategies/wyckoff');

function addIndicators(data) {
  try {
    const closes = data.map(d => (parseFloat(d.bid.c) + parseFloat(d.ask.c)) / 2);
    
    const sma20 = movingAverage(closes, 20);
    const sma50 = movingAverage(closes, 50);
    const rsi = calculateRSI(closes);
    const macd = calculateMACD(closes);
    const wyckoff = calculateWyckoff(data);

    return data.map((d, i) => ({
      ...d,
      Close: closes[i],
      SMA20: sma20[i],
      SMA50: sma50[i],
      RSI: rsi[i],
      MACD: macd.macdLine[i],
      Signal: macd.signalLine[i],
      Histogram: macd.histogram[i],
      Spread: parseFloat(d.ask.c) - parseFloat(d.bid.c),
      WyckoffPhase: wyckoff[i]?.Phase,
      Support: wyckoff[i]?.Support,
      Resistance: wyckoff[i]?.Resistance
    }));
  } catch (error) {
    console.error('Error adding indicators:', error);
    throw error;
  }
}

module.exports = { addIndicators };
