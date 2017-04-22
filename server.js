/* eslint-disable consistent-return, no-console */
const express = require('express');
const createWebpackMiddleware = require('webpack-express-middleware');
const path = require('path')
const app = express();
const pack = express();
const video = express();
const config = require('./webpack.config');
const compiler = require('webpack')(config);

const ip = process.env.IP || require('ip').address()
const port = process.env.PORT || 8443

video.get('*', function(req, res) {
  res.sendFile(path.resolve(__dirname + '/public/video.html'))
});

const webpackMiddleware = createWebpackMiddleware(compiler, config);
webpackMiddleware(pack);

app.use('/video', video)
app.use('/', pack)


const https = require('https')
const fs = require('fs')
const key = fs.readFileSync('config/ssl.key')
const cert = fs.readFileSync('config/ssl.crt')
let server = https.createServer({ key: key, cert: cert }, app)
server.listen(port, function(err) {
  if (!err) {
    console.log('Listening at ' + 'https://' + ip + ':' + port + '/')
  } else {
    console.log(err)
  }
})