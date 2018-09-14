// @format

const express = require('express');
const ws = require('ws');
const app = express();

app.use(express.static('public'));

app.get('/', function(req, res) {
  res.send('Hello World');
});

app.listen(3000);

var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({port: 8080});

wss.on('connection', function(ws) {
  ws.on('message', function(message) {
    console.log('received: %s', message);
  });

  ws.send('something');
});
