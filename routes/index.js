var express = require('express');
var router = express.Router();
var db = require('monk')(process.env.MONGOLAB_URI || 'localhost/trunk_swap');
var trunkdb = db.get('trunks');
var usersdb = db.get('users');
var dbLib = require('../lib/mongo')


/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.user) {
    res.render('index', {title: 'Trunk Man', displayName: req.user.displayName })
  } else {
    res.render('index', {title: 'Trunk Man'})
  }
});

router.get('/failed', function(req, res, next) {
  res.render('index', { title: 'We were unable to log you in with google' });
});

router.get('/loggedin', function (req, res, next) {
  // console.log(req.user);
    res.render('index', {title: 'Trunk Man', displayName: req.user.displayName})
})

module.exports = router;
