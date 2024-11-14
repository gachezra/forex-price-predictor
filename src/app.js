const { fetchForexData } = require('./data/forexDataFetcher'); // Import the fetchForexData function
const Chart = require('chart.js');
const moment = require('moment');

async function visualizeForexData(instrument, granularity, fromDate, toDate) {
  try {
    const candlesData = await fetchForexData(instrument, granularity, fromDate, toDate);

    // Prepare data for Chart.js
    const labels = candlesData.map(candle => moment.unix(candle[0]).format('YYYY-MM-DD HH:mm'));
    const openPrices = candlesData.map(candle => candle[1]);
    const highPrices = candlesData.map(candle => candle[2]);
    const lowPrices = candlesData.map(candle => candle[3]);
    const closePrices = candlesData.map(candle => candle[4]);

    // Create a candlestick chart
    const ctx = document.getElementById('chart').getContext('2d');
    new Chart(ctx, {
      type: 'candlestick',
      data: {
        labels,
        datasets: [{
          label: 'Candlesticks',
          data: candlesData.map(candle => ({
            t: candle[0],
            y: candle[2], // High
            o: candle[1], // Open
            h: candle[2], // High
            l: candle[3], // Low
            c: candle[4], // Close
          })),
          backgroundColor: closePrices.map((close, index) => close > openPrices[index] ? 'green' : 'red'),
          borderColor: 'transparent',
        }],
      },
      options: {
        responsive: true,
        tooltips: {
          mode: 'index',
          intersect: false,
          callbacks: {
            label: (tooltipItem, data) => {
              const { o, h, l, c } = tooltipItem.dataset.data[tooltipItem.index];
              return [
                `Open: ${o}`,
                `High: ${h}`,
                `Low: ${l}`,
                `Close: ${c}`,
              ];
            },
          },
        },
      },
    });
  } catch (error) {
    console.error(`Error visualizing data: ${error.message}`);
  }
}

// Example usage
visualizeForexData('EUR_USD', 'H4', '2024-11-01', '2024-11-14');