var http = require('http');
var path = require('path');
var ecstatic = require('ecstatic');
var MuxDemux = require('mux-demux');
var TapConsumer = require('tap').Consumer;
var EngineServer = require('engine.io-stream/server');
var mapping = require('mapping-stream');

var staticHandler = ecstatic(path.join(__dirname, 'static'));
var server = http.createServer(staticHandler);
var engine = EngineServer(onConnection);

engine.attach(server, '/invert');

server.listen(8080);

console.log('Listening on port 8080');
var mapping = require('mapping-stream');

var tc = new TapConsumer();
var mdm = MuxDemux(); 

function onConnection(stream) {
    
    stream.pipe(mdm).pipe(stream);
    var tapStream = mdm.createStream('tap');
    // tapStream.pipe(tc);
    // tc.on('data', function(data) {
    //   console.log(data);
    // });
    //tapStream.pipe(process.stdout, {end:false});
    var testacularStream = mdm.createStream('testacular');
    var consoleStream = mdm.createReadStream('console');

    var iv = setInterval(function () {
        testacularStream.write(String(Math.floor(Math.random() * 4)));
    }, 1e3)

    stream.once('end', function () {
        clearInterval(iv)
    })
    consoleStream.pipe(mapping(function(chunk) {
      console.log.apply(null, chunk);
    }))
    tapStream.pipe(process.stdout, {end: false});    
    // stream.pipe(process.stdout, { end : false });
}
