var mapping = require("mapping-stream");
var engine = require("engine.io-stream");
var $ = require('jquery-browserify');
var MuxDemux = require('mux-demux');
var TapProducer = require('./node_modules/tap/lib/tap-producer.js');

var stream = engine("/invert");
var tp = new TapProducer();

var mdm = MuxDemux();

var tapStream = null;
var testacularStream = null;

mdm.on('connection', function(_stream) {
  console.log('Connected', _stream.meta);
  _stream.pipe(mapping(function(chunk) {
    var element = String(chunk);
    $('#results_' + _stream.meta).append(element);
  }));
  
  if (_stream.meta === 'tap') {
      console.log(tp, _stream);
      tp.pipe(_stream);
    } else if (_stream.meta === 'testacular') {
      testacularStream = _stream;
    }
  
});

stream.pipe(mdm).pipe(stream);

setInterval(function() {
  tp.write({
    name: 'test',
    ok: true
  });
}, 1e3);
