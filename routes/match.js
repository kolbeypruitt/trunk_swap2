var express = require('express');
var router = express.Router();
var db = require('monk')(process.env.MONGOLAB_URI || 'localhost/trunk_swap');
var trunkdb = db.get('trunks');
var usersdb = db.get('users');
var dbLib = require('../lib/mongo')


/* GET matches page. */
router.get('/', function(req, res, next) {
  if(req.user) {
    dbLib.findMyMatches(req.user._id).then(function (allMatches) {
      res.render('match', {title: 'Trunk Man', allMatches: allMatches, displayName: req.user.displayName})
    }) 
  } 
  else {
    res.render('index', {title: 'Trunk Man'})
  }
});


module.exports = router;
