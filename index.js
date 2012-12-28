var mapping = require("mapping-stream");
var engine = require("engine.io-stream");
var $ = require('jquery-browserify');
var MuxDemux = require('mux-demux');
var TapProducer = require('./node_modules/tap/lib/tap-producer.js');
var rpc = require('rpc-stream');


// engine.io-stream as communication basis
var stream = engine("/invert");


// tap-producer to generate a stream of tap compliant data
var tp = new TapProducer();

// mux-demux to send the different streams over one connection
var mdm = MuxDemux();


// Replace console.log with a remote call
var rpcStream = rpc();

var console = global.console = global.console || {log: function() {}};
var browserConsoleLog = console.log;
var remoteConsoleLog = rpcStream.wrap(['log']).log;

console.log = function() {
  var args = [].slice.call(arguments);
  rpcStream.wrap('log').log(args, function() {
    
  });
  browserConsoleLog.apply(console, args);
};

// Mix and mux all the streams
mdm.on('connection', function(_stream) {
  // print some dummy data send from the server
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
    case 'rpc':
      _stream.pipe(rpcStream).pipe(_stream);
      console.log('piped');
      break;
  }
});

// Hook mux-demux into engine.io-stream
stream.pipe(mdm).pipe(stream);

// Write some data to the tap stream
setInterval(function() {
  tp.write({
    name: 'test',
    ok: true
  });
}, 1e3);


