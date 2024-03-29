var MuxDemux = require('mux-demux')
var http = require('http')
var request = require('request')


http.createServer(function (req, res) {

  var mdm2 = MuxDemux()
  mdm2.on('connection', function (stream) {
    stream.on('data', function (date) {
      console.log(stream.meta + ': ' + date)
    })
  })
  req.pipe(mdm2).pipe(res)

}).listen(8642, function () {

  var mdm1 = MuxDemux()
  var con = request({uri: 'http://localhost:8642', method: 'POST'})
  con.pipe(mdm1).pipe(con)
  var ds = mdm1.createWriteStream('times')
  var ds3 = mdm1.createWriteStream('tools')
  
  setInterval(function () {
    ds.write(new Date().toString())
  }, 1e3)
  setInterval(function() {
    ds3.write(new Date().toString())
  }, 2e3)

})

