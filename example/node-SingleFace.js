
const fs = require('fs');
const path = require('path');
const log = require('@vladmandic/pilogger');
// eslint-disable-next-line import/no-extraneous-dependencies, node/no-unpublished-require
const tf = require('@tensorflow/tfjs-node');
const faceapi = require('../dist/face-api.node.js'); // this is equivalent to '@vladmandic/faceapi'

const modelPathRoot = '../model';


class SingleFace {
    constructor(minScore, maxResults) {
        // log.header();
        log.info('SingleFace constructor:');
        this.minScore = minScore;
        this.maxResults = maxResults;
    }

    async InitModel() {
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
    }


    async image(imgBuff) {
        const decoded = tf.node.decodeImage(imgBuff);
        const casted = decoded.toFloat();
        const result = casted.expandDims(0);
        decoded.dispose();
        casted.dispose();
        return result;
    }

    async GetLandmarkDescriptors(img) {
        const optionsSSDMobileNet = new faceapi.SsdMobilenetv1Options(
            { minConfidence: this.minScore, any: this.maxResults });
        const tensor = await this.image(img);
        const result = await faceapi
            .detectAllFaces(tensor, optionsSSDMobileNet)
            .withFaceLandmarks()
            .withFaceDescriptors();

        let rc = { landmarks: "" };
        if (result.length === 1) {
            // Convert it to CSV format
            rc.landmarks = result[0].descriptor.join(', ');
        } else {
            rc.landmarks = `incorrect number of objects found: result.length=${result.length}`;
        }
        tensor.dispose();
        return (rc);
    }

}


function EuclideanDistance(csv1, csv2, tag) {
    // convert CSV to Array
    var v1 = new Float32Array( csv1.split(",") );
    var v2 = new Float32Array( csv2.split(",") );

    let s = 0.0;
    for (let i = 0; i < v1.length; ++i) {
        s += Math.pow(v1[i] - v2[i], 2);
    }
    let eqd = Math.sqrt(s);
    console.log(`EuclideanDistance on ${tag} = ${eqd}`);
}


async function main() {
    const minScore = 0.1;
    const maxResults = 5;
    const sf1 = new SingleFace(minScore, maxResults);

    // Initialize model
    await sf1.InitModel();

    let imgBuff = fs.readFileSync(path.join('./example/test1', 'modi1.jpg'));
    let rc1 = await sf1.GetLandmarkDescriptors(imgBuff);
    // log.info(JSON.stringify(rc1, null, 4));

    imgBuff = fs.readFileSync(path.join('./example/test1', 'modi2.jpg'));
    let rc2 = await sf1.GetLandmarkDescriptors(imgBuff);

    EuclideanDistance(rc1.landmarks, rc2.landmarks, '(modi1 vs modi2)');

    imgBuff = fs.readFileSync(path.join('./example/test1', 'trump1.jpg'));
    rc1 = await sf1.GetLandmarkDescriptors(imgBuff);
    // Let us test tow different persons (trump1 vs modi2)
    EuclideanDistance(rc1.landmarks, rc2.landmarks, '(trump1 vs modi2)');

    imgBuff = fs.readFileSync(path.join('./example/test1', 'trump2.jpg'));
    rc2 = await sf1.GetLandmarkDescriptors(imgBuff);
    EuclideanDistance(rc1.landmarks, rc2.landmarks, '(trump1 vs trump2)');
}


main();


