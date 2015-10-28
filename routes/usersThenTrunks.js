var express = require('express');
var router = express.Router();
var db = require('monk')(process.env.MONGOLAB_URI || 'localhost/trunk_swap');
var trunkdb = db.get('trunks');
var usersdb = db.get('users');
var dbLib = require('../lib/mongo')

router.get('/', function (req, res, next) {
  dbLib.modelDisplayObjUsersThenTrunks().then(function (viewObj) {
    console.log(viewObj);
    res.render('usersThenTrunks', {allUsers: viewObj, displayName: req.user.displayName})
  })
});

module.exports = router;