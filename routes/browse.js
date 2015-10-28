var express = require('express');
var router = express.Router();
var db = require('monk')(process.env.MONGOLAB_URI || 'localhost/trunk_swap');
var trunkdb = db.get('trunks');
var usersdb = db.get('users');
var dbLib = require('../lib/mongo')

router.get('/', function (req, res, next) {
  var records = {};
  trunkdb.find({}).then(function (allTrunks) {
    return allTrunks;
  }).then(function (allTrunks) {
    records.allTrunks = allTrunks;
    return usersdb.find({}).then(function (allUsers) {
      records.allUsers = allUsers;
      return records;
    }).then(function (records) {
      // this code is incomplete and needs to build a new object to send to view
      // we also need to make a new route to display users/trunks to satisfy
      // assessment requirements
      var allTrunks = records.allTrunks;
      var allUsers = records.allUsers;
      var viewObj = {};
      for (var i = 0; i < allTrunks.length; i++) {
        var trunk = allTrunks[i];
        // finding correct trunk for user
        var user = dbLib.findUserOfTrunk(trunk, allUsers)
        viewObj['trunk' + '_' + i] = { _id: trunk._id
                                      ,current_year: trunk.current_year
                                      ,current_model: trunk.current_model
                                      ,current_style: trunk.current_style
                                      ,firstName: user.firstName
                                      ,lastName: user.lastName
                                      ,email: user.email
                                      ,phone: user.phone
                                      ,location: 'locations pending'
                                    };
      }
      console.log(viewObj);
      res.render('browse', {allTrunks: viewObj, displayName: req.user.displayName})
    });
  });
});

module.exports = router;