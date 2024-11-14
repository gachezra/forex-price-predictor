const { movingAverage } = require('./movingAverage');

function calculateMACD(data, fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) {
  const fastMA = movingAverage(data, fastPeriod);
  const slowMA = movingAverage(data, slowPeriod);
  
  const macdLine = fastMA.map((fast, i) => fast - slowMA[i]);
  const signalLine = movingAverage(macdLine, signalPeriod);
  
  const histogram = macdLine.map((macd, i) => macd - signalLine[i]);
  
  return {
    macdLine,
    signalLine,
    histogram
  };
}

module.exports = { calculateMACD };