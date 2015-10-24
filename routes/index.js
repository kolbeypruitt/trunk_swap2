var express = require('express');
var router = express.Router();
var db = require('monk')(process.env.MONGOLAB_URI || 'localhost/trunk_swap');
var trunkdb = db.get('trunk');
var usersdb = db.get('users');
var Users = require('../lib/mongo')



/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.user) {
    res.render('index', {title: 'Trunk Man', displayName: req.user.displayName })
  } else {
    res.render('index', {title: 'Trunk Man'})
  }
});


router.get('/login', function(req, res, next) {
  res.render('index', { title: 'We failed....' });
});

router.get('/loggedin', function (req, res, next) {
  console.log(req.user);
    res.render('index', {title: 'Trunk Man', displayName: req.user.email})
})


module.exports = router;
