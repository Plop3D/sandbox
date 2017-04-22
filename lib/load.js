var fs = require('fs')
var http = require('http')
var path = require('path')
var chug = require('chug')
var config = require('lighter-config')
var state = require('./state').prototype
var express = require('express')

app.use(chug.middleware)
chug.setLog(log)
load()

app.get('/', function(req, res){
    res.sendFile(path.resolve(__dirname + '/../build/index.html'))
});
app.use(express.static(path.resolve(__dirname + '/../build')));

function load () {
  exports.public = chug('build').route()
  // exports.vendor = chug('vendor').route()

  for (var key in exports) {
    Object.defineProperty(state, key, {
      enumerable: false,
      configurable: true,
      writable: true,
      value: exports[key]
    })
  }

  chug([
    'node_modules/cute/cute.js',
    'node_modules/aframe/dist/aframe-master.js',
    'node_modules/socket.io-client/dist/socket.io.min.js'
  ])
  .each(function (asset) {
    // Hack for Sam's Note 5.
    if (/aframe/.test(asset.path)) {
      asset.content = asset.content.toString().replace(/(SM-N920)C/g, '$1T')
    }
    chug.cache.set(asset.location, asset)
    var path = asset.path.replace(/^.*\//, '/')
    asset.route(path)
  })
}

// Listen for "lighter-run" changes.
process.stdin.on('data', function (chunk) {
  var change = JSON.parse(chunk.toString())
  var path = change.path
  var asset = chug.cache.get(path)
  if (asset) {
    asset.readFile()
    asset.then(load)
  } else {
    load()
  }
})
