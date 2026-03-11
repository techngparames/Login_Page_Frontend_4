// frontend/src/utils/AIEngineLoader.js

import * as tf from "@tensorflow/tfjs";

export const lockEngine = async () => {
  if (tf.getBackend()!== "webgl") {
    await tf.setBackend("webgl");
  }

  await tf.ready();
  console.log("TF Engine Locked ✅");
};










/*import * as tf from "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-webgl";

export const lockEngine = async () => {
  try {

    if (tf.getBackend() !== "webgl") {
      await tf.setBackend("webgl");
    }

    await tf.ready();

    console.log("TF Engine Locked: webgl");

  } catch (e) {
    console.log("Engine lock safe exit");
  }
};*/