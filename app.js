var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport')
var session = require('cookie-session')
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var db = require('monk')(process.env.MONGOLAB_URI || 'localhost/trunk_swap');
var trunkdb = db.get('trunk');
var usersdb = db.get('users');
require('dotenv').load();


var routes = require('./routes/index');
var users = require('./routes/users');
var offer = require('./routes/offer');
var settings = require('./routes/settings');
var search = require('./routes/search');
var match = require('./routes/match');
var browse = require('./routes/browse');
var usersThenTrunks = require('./routes/usersThenTrunks');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'trademark.png')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret: 'keyboard cat'}))
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  name: 'session',
  keys: [
    process.env.SESSION_KEY1,
    process.env.SESSION_KEY2,
    process.env.SESSION_KEY3
  ]
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.HOST + "oauth2callback"
  },function(accessToken, refreshToken, profile, done) {
    // console.log(profile);
    // this must be findOne because find doesn't return the data
    return usersdb.findOne({ 'email': profile.emails[0].value }, function (err, user) {
      if (!user) {
        return usersdb.insert({ 'email': profile.emails[0].value
                          , 'displayName': profile.displayName
                          , 'firstName': profile.name.givenName
                          , 'lastName': profile.name.familyName
                          , 'profilePic': profile.photos[0].value
        }, function (err, user) {
          return done(err, user)
        })
      } else {
        return done(err, user)
      }
    })
  }
));


app.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'] }))

app.get('/oauth2callback', 
  passport.authenticate('google', { successRedirect:'/loggedin', failureRedirect: '/failed' }))


app.get('/logout', function(req, res){
  req.session = null;
  res.redirect('/')
});

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

app.use(function (req, res, next) {
  res.locals.user = req.user
  next()
})
app.use('/', routes);
app.use('/users', users);
app.use('/offer', offer);
app.use('/settings', settings);
app.use('/search', search);
app.use('/match', match);
app.use('/browse', browse);
app.use('/usersThenTrunks', usersThenTrunks);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;