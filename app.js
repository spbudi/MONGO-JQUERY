var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { MongoClient } = require('mongodb');
const cors = require('cors')

async function main() {
  const url = 'mongodb://localhost:27017';
  const client = new MongoClient(url);
  const dbName = 'breadsdb';
  await client.connect();
  console.log('Connected successfully to server');
  const db = client.db(dbName);
  return db;
}

main().then((db) => {
  var indexRouter = require('./routes/index');
  var usersRouter = require('./routes/users')(db);
  var app = express();

  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(cors())

  app.use('/', indexRouter);
  app.use('/users', usersRouter);
  var debug = require('debug')('mongo-jquery:server');
  var http = require('http');

  var port = normalizePort(process.env.PORT || '3000');
  app.set('port', port);

  var server = http.createServer(app);

  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);

  function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {

      return val;
    }

    if (port >= 0) {

      return port;
    }

    return false;
  }

  function onError(error) {
    if (error.syscall !== 'listen') {
      throw error;
    }

    var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  }

  function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    debug('Listening on ' + bind);
  }
}).catch((e)=> {
  console.log('failed to connect', e);
});

