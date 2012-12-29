# tap-stream

Concept of using multiple streams to communicate via [engine.io] with the browser.

Creates three different streams 
* *tap* stream: for test data
* *console* stream: for `console.log` calls
* *testacular* stream: misc communication

## Used Modules

* [engine.io-stream]: Streaming interface for [engine.io]
* [mux-demux]: Mux and demux multiple streams into one
* [tap]: Generate streams of tap data and decode those streams back again
* [browserify]: For simpler delivery of stuff :)


## Usage

```bash
$ npm install
$ node server.js
# now open http://localhost:8080 in your browser
```

## Development

```bash
$ npm install
$ grunt
$ node server.js
# now open http://localhost:8080 in your browser
```

## Todo

* Use [reconnect] for automatic reconnects

[engine.io]: https://github.com/LearnBoost/engine.io
[engine.io-stream]: https://github.com/Raynos/engine.io-stream
[mux-demux]: https://github.com/dominictarr/mux-demux
[tap]: https://github.com/isaacs/node-tap
[browserify]: https://github.com/substack/node-browserify
[mux-demux]: https://github.com/dominictarr/reconnect