function movingAverage(data, period) {
    const ma = [];
    for (let i = 0; i < data.length; i++) {
        if (i < period - 1) {
        ma.push(null);
        } else {
        const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
        ma.push(sum / period);
        }
    }
    return ma;
    }

    module.exports = { movingAverage };