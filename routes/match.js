var express = require('express');
var router = express.Router();
var db = require('monk')(process.env.MONGOLAB_URI || 'localhost/trunk_swap');
var trunkdb = db.get('trunks');
var usersdb = db.get('users');
var dbLib = require('../lib/mongo')


/* GET home page. */
router.get('/', function(req, res, next) {
  // dbLib.findMyMatches(req.user._id)
  if(req.user) {
    return usersdb.findOne({_id: req.user._id}).then(function (user) {
      return trunkdb.findOne({_id: user.trunk_id});
    }).then(function (myOffer) {
      console.log(myOffer);
      var array = [];
      array.push({ 'current_year': myOffer.desired_year })
      array.push({ 'current_model': myOffer.desired_model })
      array.push({ 'current_style': myOffer.desired_style })
      return trunkdb.find( { $and: [ array[0], array[1], array[2] ] }, function (err, allMatches) {
        console.log(allMatches)
        res.render('match', {title: 'Trunk Man', allMatches: allMatches, displayName: req.user.displayName})
      })
    })

    
  } 
  else {
    res.render('index', {title: 'Trunk Man'})
  }
});


module.exports = router;
