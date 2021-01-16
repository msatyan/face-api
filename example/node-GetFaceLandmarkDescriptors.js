// @ts-nocheck

const fs = require('fs');
const path = require('path');
const log = require('@vladmandic/pilogger');
// eslint-disable-next-line import/no-extraneous-dependencies, node/no-unpublished-require
const tf = require('@tensorflow/tfjs-node');
const faceapi = require('../dist/face-api.node.js'); // this is equivalent to '@vladmandic/faceapi'
const { mainModule } = require('process');

const modelPathRoot = '../model';
// const imgPathRoot = './example/imgtest'; // modify to include your sample images
const minScore = 0.1;
const maxResults = 5;

async function image(img) {
  const buffer = fs.readFileSync(img);
  const decoded = tf.node.decodeImage(buffer);
  const casted = decoded.toFloat();
  const result = casted.expandDims(0);
  decoded.dispose();
  casted.dispose();
  return result;
}

async function GetSingleFaceLandmarkDescriptors(img) {
  // log.header();
  log.info('GetSingleFaceLandmarkDescriptors test');
  const t0 = process.hrtime.bigint();

  await faceapi.tf.setBackend('tensorflow');
  await faceapi.tf.enableProdMode();
  await faceapi.tf.ENV.set('DEBUG', false);
  await faceapi.tf.ready();

  // log.state(`Version: TensorFlow/JS ${faceapi.tf?.version_core} FaceAPI ${faceapi.version.faceapi} Backend: ${faceapi.tf?.getBackend()}`);
  // log.info('Loading FaceAPI models');

  const modelPath = path.join(__dirname, modelPathRoot);
  await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath);
  await faceapi.nets.faceLandmark68Net.loadFromDisk(modelPath);
  await faceapi.nets.faceRecognitionNet.loadFromDisk(modelPath);
  const optionsSSDMobileNet = new faceapi.SsdMobilenetv1Options({ minConfidence: minScore, maxResults });

  const tensor = await image(img);
  const result = await faceapi
    .detectAllFaces(tensor, optionsSSDMobileNet)
    .withFaceLandmarks()
    .withFaceDescriptors();

  let rc = { landmarks: "" };
  if (result.length === 1) {
    rc.landmarks = result[0].descriptor.join(', ');
  } else {
    rc.landmarks = `incorrect number of objects found: result.length=${result.length}`;
  }
  tensor.dispose();
  return( rc );
}

// v1 & v2 are of Float32Array
function MyEuclideanDistance(v1, v2) {
  let s = 0.0;
  for (let i = 0; i < v1.length; ++i) {
    s += Math.pow(v1[i] - v2[i], 2);
  }
  let eqd = Math.sqrt(s);
  console.log(`MyEuclideanDistance = ${eqd}`);
}


async function main() {

  let p  = './example';
  let img = 'sample (1).jpg'

  let test1 = true;
  if ( test1 === true) {
    p = './example/test1';
    img = "modi1.jpg";
  }

  let imgPath = path.join( p, img);
  // console.log(`Image = ${imgPath}`);

  let rc = await GetSingleFaceLandmarkDescriptors(imgPath);
  console.log(JSON.stringify(rc, null, 4));
}


main();

