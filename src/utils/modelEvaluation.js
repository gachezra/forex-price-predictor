const tf = require('@tensorflow/tfjs-node');

function calculateMSE(yTrue, yPred) {
  return tf.losses.meanSquaredError(yTrue, yPred).arraySync();
}

function calculateMAE(yTrue, yPred) {
  return tf.losses.absoluteDifference(yTrue, yPred).arraySync();
}

function calculateRMSE(yTrue, yPred) {
  return Math.sqrt(calculateMSE(yTrue, yPred));
}

function calculateSharpeRatio(returns, riskFreeRate = 0) {
  const meanReturn = tf.mean(returns);
  const stdReturn = tf.moments(returns).variance.sqrt();
  return meanReturn.sub(riskFreeRate).div(stdReturn);
}

function evaluateModel(model, testX, testY) {
  console.log('evaluateModel - testX shape:', testX.shape);
  console.log('evaluateModel - testY shape:', testY.shape);

  const predictions = model.predict(testX);
  console.log('evaluateModel - predictions shape:', predictions.shape);

  // Ensure predictions and testY have the same shape
  const minLength = Math.min(predictions.shape[0], testY.shape[0]);
  const adjustedPredictions = predictions.slice([0, 0], [minLength, -1]);
  const adjustedTestY = testY.slice([0, 0], [minLength, -1]);

  console.log('evaluateModel - Adjusted predictions shape:', adjustedPredictions.shape);
  console.log('evaluateModel - Adjusted testY shape:', adjustedTestY.shape);

  const mse = calculateMSE(adjustedTestY, adjustedPredictions);
  const mae = calculateMAE(adjustedTestY, adjustedPredictions);
  const rmse = calculateRMSE(adjustedTestY, adjustedPredictions);

  // Calculate returns
  const actualReturns = adjustedTestY.slice([1, 0], [minLength - 1, -1])
                                     .sub(adjustedTestY.slice([0, 0], [minLength - 1, -1]))
                                     .div(adjustedTestY.slice([0, 0], [minLength - 1, -1]));
  const predictedReturns = adjustedPredictions.slice([1, 0], [minLength - 1, -1])
                                               .sub(adjustedPredictions.slice([0, 0], [minLength - 1, -1]))
                                               .div(adjustedPredictions.slice([0, 0], [minLength - 1, -1]));

  console.log('evaluateModel - actualReturns shape:', actualReturns.shape);
  console.log('evaluateModel - predictedReturns shape:', predictedReturns.shape);

  let sharpeRatio;
  try {
    sharpeRatio = calculateSharpeRatio(actualReturns);
  } catch (error) {
    console.error('Error calculating Sharpe ratio:', error);
    sharpeRatio = tf.scalar(NaN);
  }

  return {
    mse,
    mae,
    rmse,
    sharpeRatio: sharpeRatio.arraySync()
  };
}

module.exports = { evaluateModel };
