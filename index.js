var mapping = require("mapping-stream");
var engine = require("engine.io-stream");
var $ = require('jquery-browserify');
var MuxDemux = require('mux-demux');
var TapProducer = require('./node_modules/tap/lib/tap-producer.js');
var inject = require('reconnect/inject')


// Reconnect magic
var reconnect = inject(function() {
  var args = [].slice.call(arguments);
  console.log(args);
  return engine.apply(null, args);
});

// tap-producer to generate a stream of tap compliant data
var tp = new TapProducer();

// mux-demux to send the different streams over one connection
var mdm = MuxDemux();


// Replace console.log with a remote call
var streamConsole = function(_stream) {
  var console = global.console = global.console || {log: function() {}};
  var browserConsoleLog = console.log;
  

  console.log = function() {
    var args = [].slice.call(arguments);
    _stream.write(args);
    browserConsoleLog.apply(console, args);
  };
  
};


// Mix and mux all the streams
mdm.on('connection', function(_stream) {
  // print some dummy data send from the server
  console.log('Connected: ' + _stream.meta);
  _stream.pipe(mapping(function(chunk) {
    var element = String(chunk);
    $('#results_' + _stream.meta).append(element);
  }));
  
  // entangle the streams
  switch (_stream.meta) {
    case 'tap':
      tp.pipe(_stream);
      break;
    case 'testacular':
      break;
    case 'console':
      streamConsole(_stream);
      console.log('streaming console.log')
      break;
  }
});

var connection = window.connection = reconnect({
  type: 'exponential',
  randomisationFactor: 0.5,
  initialDelay: 10,
  maxDelay: 10000
});
  
connection.on('connect', function(stream) {
  // Hook mux-demux into engine.io-stream
  stream.pipe(mdm).pipe(stream);

  console.log('Connected');
}).connect('/invert');

connection.on('reconnect', function(attempts, delay) {
  console.log('Reconnecting', attempts, delay, connection.reconnect);
});
connection.on('disconnect', function(stream) {
  console.log('disconnected');
});
connection.on('backoff', function(stream) {
  console.log('backoff');

});
// Write some data to the tap stream
setInterval(function() {
  tp.write({
    name: 'test',
    ok: true
  });
}, 2e3);


