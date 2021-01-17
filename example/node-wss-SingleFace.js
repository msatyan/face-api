const fs = require('fs');
const WebSocket = require('ws')
// const canvas = require('canvas')
const {Base64} = require('js-base64');

const wss = new WebSocket.Server({ port: 8080 })

const uuid = require("uuid");

// const fs = require('fs');
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

    async Init() {
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
        // const tensor = await canvas.loadImage(img)
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
        return (rc);
    }

}


//////////////////////////////////////////////
wss.on('connection', async (ws) => {
    ws['id'] = uuid.v4();
    const minScore = 0.1;
    const maxResults = 5;
    const myFace1 = new SingleFace(minScore, maxResults);

    console.log('Testing-1');
    ws.on('message', async (message) => {
        console.log(`Received message => ${message}`)
        //////////////////////////////
        console.log('Testing-2');
        await myFace1.Init();
        console.log('Testing-3');
        let req;
        let action = "";
        let id = 0;

        var message_text = message.toString('utf8');
        // console.log( "typeof(message) : " + typeof(message));
        // console.log( "typeof(message_text) : " + typeof(message_text));


        /////////// Parse incoming message ///////////
        try {
            req = JSON.parse(message);
            action = req.action;
            id = req.id;
            console.log(`action : ${action}, id = ${id} `);
        }
        catch (error) {
            console.log(message_text);
            // const buff = fs.writeFileSync( './0.out.js', message_text);
            console.log("JSON.parse Error: message in param");
            console.log("message.len = " + message_text.length);
        }

        /////////// server: GetImgLandmarks ///////////
        let res = JSON.stringify({ xid: 0, id: id, action: `${action} is unknown request` });
        if (action === 'GetImgLandmarks') {
            console.log('GetImgLandmarks *:');
            let buff1 = Base64.toUint8Array(req.img1);
            let rc = await myFace1.GetLandmarkDescriptors(buff1);
            res = rc.landmarks;
            // res = "GetLandmarkDescriptors OK !!!!!";
        }

        console.log('res len =' + res.length);
        ws.send(res);
    });
    ws.send('Hello! Message From Server!!')
})