const fs = require('fs');
const path = require('path');

// // client.js
const WebSocket = require('ws')
const url = 'ws://localhost:8080'
const connection = new WebSocket(url)

connection.onopen = () => {
  let msg = {
    id: 0,
    action: 'GetImgLandmarks',
    img1: ""
  };

  let imgBuff = fs.readFileSync(path.join('./example/test1', 'modi1.jpg'));
  let base64_string = imgBuff.toString('base64')
  // msg.img1 = "data:image/jpeg;base64," + base64_string;
  msg.img1 =  base64_string;

  let req = JSON.stringify( msg );
  connection.send(req);
}

connection.onerror = (error) => {
  console.log(`WebSocket error: ${error}`)
}

connection.onmessage = (e) => {
  console.log(e.data)
}

