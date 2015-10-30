var express = require('express');
var router = express.Router();
var db = require('monk')(process.env.MONGOLAB_URI || 'localhost/trunk_swap');
var trunkdb = db.get('trunks');
var usersdb = db.get('users');
var dbLib = require('../lib/mongo')

router.get('/', function (req, res, next) {
  // dbLib.modelDisplayObjUsersThenTrunks().then(function (viewObj) {
  //   console.log(viewObj);
  //   res.render('usersThenTrunks', {allUsers: viewObj, displayName: req.user.displayName})
  // })
  var records = {};
  return trunkdb.find({}).then(function (allTrunks) {
    return allTrunks;
  })
  .then(function (allTrunks) {
    records.allTrunks = allTrunks;
    return usersdb.find({}).then(function (allUsers) {
      records.allUsers = allUsers;
      return records;
    })
    .then(function (records) {
      var allTrunks = records.allTrunks;
      var allUsers = records.allUsers;
      var viewObj = {};
      for (var i = 0; i < allUsers.length; i++) {
        allUsers[i]
        // need to come back here and get this going
      }
      for (var i = 0; i < allTrunk.length; i++) {
        // may not need this loop
        var trunk = allTrunks[i];
        var user = dbLib.findUserOfTrunk(trunk, allUsers)
        viewObj['user' + '_' + i] = { _id: trunk._id
                                      ,current_year: trunk.current_year
                                      ,current_model: trunk.current_model
                                      ,current_style: trunk.current_style
                                      ,firstName: user.firstName
                                      ,lastName: user.lastName
                                      ,email: user.email
                                      ,phone: user.phone
                                      ,location: 'locations pending'
                                    };
      };
      console.log(viewObj);
      return viewObj
    });
  });
});

module.exports = router;