const tf = require('@tensorflow/tfjs-node');

function buildModel(inputShape, learningRate = 0.001) {
  const model = tf.sequential();
  
  model.add(tf.layers.conv1d({
    inputShape: inputShape,
    kernelSize: 5,
    filters: 16,
    strides: 1,
    activation: 'relu',
    kernelInitializer: 'varianceScaling'
  }));
  
  model.add(tf.layers.maxPooling1d({poolSize: 2, strides: 2}));
  
  model.add(tf.layers.dropout(0.2));  // Add dropout
  
  model.add(tf.layers.conv1d({
    kernelSize: 3,
    filters: 32,
    strides: 1,
    activation: 'relu',
    kernelInitializer: 'varianceScaling'
  }));
  
  model.add(tf.layers.maxPooling1d({poolSize: 2, strides: 2}));
  
  model.add(tf.layers.dropout(0.2));  // Add dropout
  
  model.add(tf.layers.flatten());
  
  model.add(tf.layers.dense({
    units: 64,
    activation: 'relu',
    kernelInitializer: 'varianceScaling'
  }));
  
  model.add(tf.layers.dropout(0.5));  // Add dropout
  
  model.add(tf.layers.dense({
    units: 1,
    activation: 'linear'
  }));
  
  const optimizer = tf.train.adam(learningRate);
  model.compile({
    optimizer: optimizer,
    loss: 'meanSquaredError',
    metrics: ['mse']
  });
  
  return model;
}

module.exports = { buildModel };