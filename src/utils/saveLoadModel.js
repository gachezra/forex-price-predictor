const tf = require('@tensorflow/tfjs-node');
const fs = require('fs').promises;

async function saveModel(model, path) {
  await model.save(`file://${path}`);
}

async function loadModel(path) {
  return await tf.loadLayersModel(`file://${path}/model.json`);
}

module.exports = { saveModel, loadModel };