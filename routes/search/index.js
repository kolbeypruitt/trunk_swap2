var express = require('express');
var router = express.Router();
var dbLib = require('../../lib/mongo')
var db = require('monk')(process.env.MONGOLAB_URI || 'localhost/trunk_swap');
var trunkdb = db.get('trunks');
var usersdb = db.get('users');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('search/index', { title: 'Post Offer', displayName: req.user.displayName })
});

router.post('/', function(req, res, next) {
  dbLib.searchForTrunk(req.body)
  .then(function (docs) {
    res.render('search/results', { title: 'Post Offer', displayName:req.user.displayName, allTrunks: docs });
  })
});

router.get('/:id', function(req, res, next) {
  dbLib.searchShowOffer(req.params).then(function (record) {
    console.log(record);
    res.render('search/show', {theTrunk: record, displayName:req.user.displayName});
  })
});

module.exports = router;
