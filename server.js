/* eslint-disable consistent-return, no-console */
const express = require('express');
const path = require('path')
const config = require('./webpack.config');
const ip = process.env.IP || require('ip').address()
const port = process.env.PORT || 8443
const isDevelopment = process.env.NODE_ENV !== 'production';

if (isDevelopment){
  const app = express();
  const video = express();
  video.get('*', function(req, res) {
    res.sendFile(path.resolve(__dirname + '/public/video.html'))
  });
  app.use('/video', video)

  const pack = express();
  const createWebpackMiddleware = require('webpack-express-middleware');
  const compiler = require('webpack')(config);
  const webpackMiddleware = createWebpackMiddleware(compiler, config);
  webpackMiddleware(pack);
  app.use('/', pack)
  const https = require('https')
  const fs = require('fs')
  const key = fs.readFileSync('config/ssl.key')
  const cert = fs.readFileSync('config/ssl.crt')
  https.createServer({ key: key, cert: cert }, app)
    .listen(port, function(err) {
      if (!err) {
        console.log('Listening at ' + 'https://' + ip + ':' + port + '/')
      } else {
        console.log(err)
      }
    })
} else {
  const http = require('http')
  http.createServer(app).listen(port)
  let router = app.Router({strict: true})
  router.get('/video', function(req, res) {
    res.sendFile(path.resolve(config.output.path + '/video.html'))
  });
  router.get('/', function(req, res) {
    res.sendFile(path.resolve(config.output.path + '/index.html'))
  });
  app.use(router)
  app.use(express.static(path.resolve(config.output.path)));
}


