const tf = require('@tensorflow/tfjs-node');

function normalizeData(data) {
  const mean = tf.mean(data, 0);
  const variance = tf.moments(data, 0).variance;
  const std = tf.sqrt(variance);
  return {
    normalizedData: data.sub(mean).div(std),
    mean: mean,
    std: std
  };
}

function denormalizeData(normalizedData, mean, std) {
  return normalizedData.mul(std).add(mean);
}

module.exports = { normalizeData, denormalizeData };