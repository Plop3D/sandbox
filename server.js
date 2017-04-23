/* eslint-disable consistent-return, no-console */
const express = require('express');
const path = require('path')
const config = require('./webpack.config');
const ip = process.env.IP || require('ip').address()
const port = process.env.PORT || 8443
const isDevelopment = process.env.NODE_ENV !== 'production';

const app = express();

const passport = require('passport');
const Strategy = require('passport-facebook').Strategy;

// Configure view engine to render EJS templates.
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

// Define routes.
app.get('/sandbox',
  function(req, res) {
    res.render('home', { user: req.user });
  });

app.get('/login',
  function(req, res) {
    res.render('login');
  });

app.get('/login/facebook',
  passport.authenticate('facebook'));

app.get('/login/facebook/return',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res) {
    res.render('profile', { user: req.user });
  });

app.get('/login/facebook/return',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res) {
    res.render('profile', { user: req.user });
  });

const callbackURL = isDevelopment
  ? 'https://localhost:8443/login/facebook/return'
  : 'https://plop3d.herokuapp.com/login/facebook/return'

// Configure the Facebook strategy for use by Passport.
//
// OAuth 2.0-based strategies require a `verify` function which receives the
// credential (`accessToken`) for accessing the Facebook API on the user's
// behalf, along with the user's profile.  The function must invoke `cb`
// with a user object, which will be set at `req.user` in route handlers after
// authentication.
passport.use(new Strategy({
    clientID: "1821853544798226",
    clientSecret: "7511005ea02d7a27808bd53fa5882937",
    callbackURL: callbackURL
  },
  function(accessToken, refreshToken, profile, cb) {
    // In this example, the user's Facebook profile is supplied as the user
    // record.  In a production-quality application, the Facebook profile should
    // be associated with a user record in the application's database, which
    // allows for account linking and authentication with other identity
    // providers.
    return cb(null, profile);
  }));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

if (isDevelopment) {
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
  let router = express.Router({ strict: true })
  router.get('/video', function(req, res) {
    res.sendFile(path.resolve(config.output.path + '/video.html'))
  });
  router.get('/', function(req, res) {
    res.sendFile(path.resolve(config.output.path + '/index.html'))
  });
  app.use(router)
  app.use(express.static(path.resolve(config.output.path)));
}


