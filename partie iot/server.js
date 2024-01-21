const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 2222 });
const { SerialPort } = require('serialport');
const { ByteLengthParser } = require('@serialport/parser-byte-length');
const parser1 = new ByteLengthParser({ length: 2 });
const parser7 = new ByteLengthParser({ length: 2 });

let dataFromCOM1;
let dataFromCOM7;

const config1 = {
  path: 'COM1',
  baudRate: 9600,
  dataBits: 8,
  parity: 'none',
  stopBits: 1,
  autoOpen: false,
};

const config7 = {
  path: 'COM7',
  baudRate: 9600,
  dataBits: 8,
  parity: 'none',
  stopBits: 1,
  autoOpen: false,
};

const port1 = new SerialPort(config1);
const port7 = new SerialPort(config7);

port1.open((err) => {
  if (err) {
    console.log('error opening the port COM1: ' + err.messages);
  }
});

port7.open((err) => {
  if (err) {
    console.log('error opening the port COM7: ' + err.messages);
  }
});

port1.pipe(parser1);
port7.pipe(parser7);

parser1.on('data', (data) => {
  dataFromCOM1 = data;
  console.log('Data from COM1:', parseInt(dataFromCOM1));
});

parser7.on('data', (data) => {
  dataFromCOM7 = data;
  console.log('Data from COM7:', parseInt(dataFromCOM7));
});

wss.on('connection', function connection(ws) {
  console.log('WebSocket client connected');

  setInterval(() => {
    const sensorValue1 = parseInt(dataFromCOM1);
    const sensorValue7 = parseInt(dataFromCOM7);

    ws.send(JSON.stringify({ COM1: sensorValue1 }));
    ws.send(JSON.stringify({ COM7: sensorValue7 }));


  }, 2000);
});
