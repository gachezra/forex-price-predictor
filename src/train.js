const tf = require('@tensorflow/tfjs-node');
const moment = require('moment');
const { buildModel } = require('./models/model');
const { prepareData, splitData } = require('./data/dataPrep');
const { normalizeData, denormalizeData } = require('./data/dataNormalization');
const { fetchForexData } = require('./data/forexDataFetcher');
const { addIndicators } = require('./utils/indicators');
const { evaluateModel } = require('./utils/modelEvaluation');
const { tuneHyperparameters } = require('./utils/hyperparameterTuning');
const { saveModel, loadModel } = require('./utils/saveLoadModel');

async function main() {
  try {
    // Fetch and prepare data
    const startDate = moment().subtract(6, 'months').toDate();
    const endDate = new Date();
    const rawData = await fetchForexData('EUR_USD', 'H4', startDate, endDate);
    console.log('Fetched raw data:', rawData.length, 'samples');
    
    const processedData = addIndicators(rawData);
    console.log('Processed data:', processedData.length, 'samples');

    // Log Wyckoff Phase
    const wyckoffPhases = processedData.map(d => d.WyckoffPhase);
    const latestPhase = wyckoffPhases[wyckoffPhases.length - 1];
    console.log('Latest Wyckoff Phase:', latestPhase);

    if (latestPhase === 'Accumulation') {
      console.log('The market is in an Accumulation phase, consider buying opportunities.');
    } else if (latestPhase === 'Distribution') {
      console.log('The market is in a Distribution phase, consider selling opportunities.');
    } else {
      console.log('The market is Neutral, monitor further developments.');
    }
    
    const dataForNormalization = processedData.map(d => [
      d.Close, d.SMA20, d.SMA50, d.RSI, d.MACD, d.Signal, d.Histogram, d.Spread, d.volume
    ]);
    
    const { normalizedData, mean, std } = normalizeData(tf.tensor2d(dataForNormalization));
    console.log('Normalized data shape:', normalizedData.shape);
    
    const windowSize = 10;
    const targetIndex = 0; // Predicting the Close price
    const [X, y] = prepareData(normalizedData.arraySync(), windowSize, targetIndex);
    console.log('X shape:', X.shape);
    console.log('y shape:', y.shape);
    
    // Split data
    const [trainX, trainY, valX, valY, testX, testY] = splitData(X, y);
    console.log('trainX shape:', trainX.shape);
    console.log('trainY shape:', trainY.shape);
    console.log('valX shape:', valX.shape);
    console.log('valY shape:', valY.shape);
    console.log('testX shape:', testX.shape);
    console.log('testY shape:', testY.shape);
    
    // Hyperparameter tuning
    const paramGrid = {
      learningRates: [0.001, 0.01],
      batchSizes: [32, 64],
      epochs: 100
    };

    console.log('Before tuning - valX shape:', valX.shape, 'valY shape:', valY.shape);
    
    const bestModel = await tuneHyperparameters(trainX, trainY, valX, valY, paramGrid);
    
    // Train best model
    await bestModel.fit(trainX, trainY, {
      epochs: 100,
      batchSize: 32,
      validationData: [valX, valY],
      callbacks: tf.node.tensorBoard('/tmp/fit_logs')
    });
    
    // Evaluate model
    const testPerformance = evaluateModel(bestModel, testX, testY);
    console.log('Test Performance:', testPerformance);
    
    // Save model
    await saveModel(bestModel, './saved_model');
    
    // Make prediction
    const lastDataPoint = tf.tensor3d([dataForNormalization.slice(-windowSize)]);
    const normalizedPrediction = bestModel.predict(lastDataPoint);
    const prediction = denormalizeData(normalizedPrediction, mean, std);
    console.log('Prediction shape:', prediction.shape);
    
    const timesUp = new Date();

    console.log('Time of prediction: ', timesUp); 
    console.log('Predicted next close price:', prediction.dataSync()[0]);
  } catch (error) {
    console.error('A training error occurred:', error);
  }
}

main();
