var express = require('express');
var router = express.Router();
var db = require('monk')(process.env.MONGOLAB_URI || 'localhost/trunk_swap');
var trunkdb = db.get('trunks');
var usersdb = db.get('users');
var dbLib = require('../lib/mongo')


/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.user) {
    // console.log(req.user);
    // console.log(req.body);
    usersdb.findOne({_id: req.user._id}).then(function (user) {
      return trunkdb.find({_id: user.trunk_id});
    }).then(function (myTrunk) {
      // this should find the my users trunk offer
      // next we need to run the searchForTrunk method in lib folder
        dbLib.findTrunkMatch(myTrunk).then(function (matches) {
        console.log(matches);
        res.render('match', {title: 'Trunk Man', displayName: req.user.displayName, matches: matches })
      })
      
    })


    res.render('match', {title: 'Trunk Man', displayName: req.user.displayName })
  } else {
    res.render('index', {title: 'Trunk Man'})
  }
});


module.exports = router;
