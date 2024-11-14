const axios = require('axios');
const moment = require('moment');

async function fetchForexData(instrument, granularity, fromDate, toDate) {
  const from = moment(fromDate).unix();
  const to = moment(toDate).unix();
  const url = `https://r5kqwvuxa7.execute-api.eu-central-1.amazonaws.com/v1/instruments/${instrument}/candles?granularity=${granularity}&from=${from}&to=${to}`;

  try {
    const response = await axios.get(url);
    return response.data.candles;
  } catch (error) {
    console.error(`Error fetching data: ${error.response.status}, ${error.response.statusText}`);
    throw error;
  }
}

module.exports = { fetchForexData };