const { buildModel } = require('../models/model');
const { evaluateModel } = require('./modelEvaluation');

async function tuneHyperparameters(trainX, trainY, valX, valY, paramGrid) {
  console.log('tuneHyperparameters - trainX shape:', trainX.shape);
  console.log('tuneHyperparameters - trainY shape:', trainY.shape);
  console.log('tuneHyperparameters - valX shape:', valX.shape);
  console.log('tuneHyperparameters - valY shape:', valY.shape);

  let bestModel = null;
  let bestPerformance = Infinity;

  for (const learningRate of paramGrid.learningRates) {
    for (const batchSize of paramGrid.batchSizes) {
      console.log(`Trying learning rate: ${learningRate}, batch size: ${batchSize}`);
      
      const model = buildModel(trainX.shape.slice(1), learningRate);
      
      try {
        console.log('Training model...');
        await model.fit(trainX, trainY, {
          epochs: paramGrid.epochs,
          batchSize: batchSize,
          validationData: [valX, valY],
          verbose: 0
        });
  
        console.log('Evaluating model...');
        const performance = evaluateModel(model, valX, valY);
        console.log(`Performance: MSE = ${performance.mse}, MAE = ${performance.mae}, RMSE = ${performance.rmse}, Sharpe Ratio = ${performance.sharpeRatio}`);
        
        if (performance.mse < bestPerformance) {
          bestModel = model;
          bestPerformance = performance.mse;
          console.log('New best model found');
        }
      } catch (error) {
        console.error('Error during hyperparameter tuning:', error);
        console.error('Error stack:', error.stack);
      }
    }
  }

  return bestModel;
}

module.exports = { tuneHyperparameters };