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
      for (var i = 0; i < allTrunks.length; i++) {
        allTrunks[i].user_id
      }
      res.render('browse', {allTrunks: allTrunks, allUsers: allUsers, displayName: req.user.displayName})
    });
  });
});

module.exports = router;