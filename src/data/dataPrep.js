const tf = require('@tensorflow/tfjs-node');

function prepareData(data, windowSize, targetIndex) {
  const X = [];
  const y = [];
  
  for (let i = 0; i < data.length - windowSize; i++) {
    X.push(data.slice(i, i + windowSize).map(d => [
      d[0], d[1], d[2], d[3], d[4], d[5], d[6], d[7], d[8]
    ]));
    y.push(data[i + windowSize][targetIndex]);
  }
  
  console.log('prepareData - X length:', X.length);
  console.log('prepareData - y length:', y.length);
  
  return [tf.tensor3d(X), tf.tensor2d(y, [y.length, 1])];
}

function splitData(X, y, trainRatio = 0.7, valRatio = 0.15) {
  const totalSamples = X.shape[0];
  const trainSize = Math.floor(totalSamples * trainRatio);
  const valSize = Math.floor(totalSamples * valRatio);
  const testSize = totalSamples - trainSize - valSize;
  
  console.log('splitData - totalSamples:', totalSamples);
  console.log('splitData - trainSize:', trainSize);
  console.log('splitData - valSize:', valSize);
  console.log('splitData - testSize:', testSize);

  const trainX = X.slice([0, 0, 0], [trainSize, -1, -1]);
  const trainY = y.slice([0, 0], [trainSize, -1]);
  
  const valX = X.slice([trainSize, 0, 0], [valSize, -1, -1]);
  const valY = y.slice([trainSize, 0], [valSize, -1]);
  
  const testX = X.slice([trainSize + valSize, 0, 0], [testSize, -1, -1]);
  const testY = y.slice([trainSize + valSize, 0], [testSize, -1]);
  
  return [trainX, trainY, valX, valY, testX, testY];
}

module.exports = { prepareData, splitData };