var http = require('http');
var path = require('path');
var ecstatic = require('ecstatic');
var MuxDemux = require('mux-demux');
var TapConsumer = require('tap').Consumer;
var EngineServer = require('engine.io-stream/server');
var rpc = require('rpc-stream');

var staticHandler = ecstatic(path.join(__dirname, 'static'));
var server = http.createServer(staticHandler);
var engine = EngineServer(onConnection);

engine.attach(server, '/invert');

server.listen(8080);

console.log('Listening on port 8080');
var mapping = require('mapping-stream');

var tc = new TapConsumer();

function onConnection(stream) {
    var mdm = MuxDemux(); 
    stream.pipe(mdm).pipe(stream);
    var tapStream = mdm.createStream('tap');
    // tapStream.pipe(tc);
    // tc.on('data', function(data) {
    //   console.log(data);
    // });
    //tapStream.pipe(process.stdout, {end:false});
    var testacularStream = mdm.createStream('testacular');
    var rpcStream = mdm.createStream('rpc');
    rpcFunctions = rpc({
      log: function(args, callback) {
        console.log.apply(console, args);
        callback();
      }
    });
    rpcStream.pipe(rpcFunctions).rpcStream;
    var iv = setInterval(function () {
        testacularStream.write(String(Math.floor(Math.random() * 4)));
    }, 1e3)

    stream.once('end', function () {
        clearInterval(iv)
    })

    stream.pipe(process.stdout, { end : false })
}
