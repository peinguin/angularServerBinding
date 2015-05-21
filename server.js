var express = require('express')
  , fs = require('fs')
  , app = express()
  , server = require('http').Server(app)
  , eventEmitter = new (require('events').EventEmitter)()
//config
  , PORT = 8000
;

server.listen(PORT, function () {
  console.log('Server started at', PORT);
});

// static
app.use(express.static('client'));
app.get('/socket.io.js', function (req, res) {
  res.sendFile(__dirname + '/node_modules/socket.io/node_modules/socket.io-client/socket.io.js');
});

//socket.io
var io = require('socket.io')(server)
  , unsubscribe = function(entry) {
    this.leave(entry);
    console.log('client', this.id, 'unsubscribe', entry);
  }
  , change = function(operation, row) {
    var file = row.k
      , entry = file
        .replace(__dirname + '/', '')
        .replace(/\.json$/, '')
    ;
    sendFile(entry);
  }
  , sendFile = function(entry) {
    var filename = __dirname + '/' + entry + '.json';
    fs.stat(filename, function(err, stat) {
      if(err) {
        return; // file does not exist more
      }
      fs.readFile(filename, 'utf8', function(err, file) {
        if (err) {
	  throw err;
        }
        file = JSON.parse(file);
        io.to(entry).emit(entry, file);
        console.log('sended', entry);
      }.bind(this));
    }.bind(this));
  }
;

io.on('connection', function(client) {
  console.log('New client connected', client.id, client.conn.remoteAddress);
 
  client.on('subscribe', function(entry) {
    unsubscribe.call(this, entry);
    this.join(entry);
    sendFile(entry);
    console.log('client', this.id, 'subscribed', entry);
  });

  client.on('unsubscribe', unsubscribe);
});

eventEmitter.on('insert', change.bind(null, 'insert'));
eventEmitter.on('update', change.bind(null, 'update'));
eventEmitter.on('delete', change.bind(null, 'delete'));
eventEmitter.on('truncate', change.bind(null, 'truncate'));

// DBMon
require('dbmon').channel({
  driver: 'filesystem',
  driverOpts: {
    filesystem: {
      root: __dirname + '/phones'
    }
  },
  method: 'inotifywait',
  transports: 'eventEmitter',
  transportsOpts: {
    eventEmitter: {
      eventEmitter: eventEmitter
    }
  }
});
