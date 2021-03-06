//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//
var http = require('http');
var path = require('path');

var async = require('async');
var socketio = require('socket.io');
var express = require('express');

//
// ## SimpleServer `SimpleServer(obj)`
//
// Creates a new instance of SimpleServer with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//
var router = express();
var server = http.createServer(router);
var io = socketio.listen(server);

router.use(express.static(path.resolve(__dirname, 'client')));
var guid = require('./utils/guid.js');
router.use(express.bodyParser());
/*
router.use(express.bodyParser());


router.get('/api/test', function(req, res) {
  
  var var1 = req.query.var1;
  var var2 = req.query.var2;
  var var3 = req.query.var3;
  var var4 = req.query.var4;
  var var5 = req.query.var5;
  
  var responseJson = {};
  
  
  responseJson.dateOfRequest = new Date();
  
  responseJson.var1PassedIn = var1;
  responseJson.var2PassedIn = var2;
  responseJson.var3PassedIn = var3;
  responseJson.var4PassedIn = var4;
  responseJson.var5PassedIn = var5;
  
	res.json(200, responseJson);
});
*/
router.get('/api/guid', function(req, res) {
	res.json(200, {guid:guid.generate(req.query.useDashes)});
});


var messages = [];
var sockets = [];

io.on('connection', function (socket) {
    messages.forEach(function (data) {
      socket.emit('message', data);
    });

    sockets.push(socket);

    socket.on('disconnect', function () {
      sockets.splice(sockets.indexOf(socket), 1);
      updateRoster();
    });

    socket.on('message', function (msg) {
      var text = String(msg || '');

      if (!text)
        return;

      socket.get('name', function (err, name) {
        var data = {
          name: name,
          text: text
        };

        broadcast('message', data);
        messages.push(data);
      });
    });

    socket.on('identify', function (name) {
      socket.set('name', String(name || 'Anonymous'), function (err) {
        updateRoster();
      });
    });
  });

function updateRoster() {
  async.map(
    sockets,
    function (socket, callback) {
      socket.get('name', callback);
    },
    function (err, names) {
      broadcast('roster', names);
    }
  );
}

function broadcast(event, data) {
  sockets.forEach(function (socket) {
    socket.emit(event, data);
  });
}

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});
