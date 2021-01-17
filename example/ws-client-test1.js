// client.js
const WebSocket = require('ws')
const url = 'ws://localhost:8080'
const connection = new WebSocket(url)

connection.onopen = () => {
  let msg = {
    id: 0,
    action: 'GetImgLandmarks'
  };

  let req = JSON.stringify( msg );
  connection.send(req);
}

connection.onerror = (error) => {
  console.log(`WebSocket error: ${error}`)
}

connection.onmessage = (e) => {
  console.log(e.data)
}

