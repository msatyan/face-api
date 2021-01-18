const fs = require('fs');
const path = require('path');

// // client.js
const WebSocket = require('ws')
const url = 'ws://localhost:8080'
const connection = new WebSocket(url)

function myExitFunc(con) {
  con.close();
  console.log();
}


connection.onopen = () => {
  let msg = {
    id: 0,
    action: 'GetImgLandmarks',
    img1: ""
  };

  let fpath = path.join('./demo1/img', 'modi1.jpg');

  // If Command-line Arguments is given use that.
  if ( process.argv.length === 3) {
    fpath = path.join(process.argv[2]);
  }

  let imgBuff = fs.readFileSync(fpath);
  let base64_string = imgBuff.toString('base64')
  // msg.img1 = "data:image/jpeg;base64," + base64_string;
  msg.img1 =  base64_string;

  let req = JSON.stringify( msg );
  connection.send(req);

  // We are done the test, let us close connection and end program.
  // execute as close to milliseconds
  setTimeout( myExitFunc, 1000, connection );
}

connection.onerror = (error) => {
  console.log(`WebSocket error: ${error}`)
}

connection.onmessage = (e) => {
  console.log(e.data)
}

