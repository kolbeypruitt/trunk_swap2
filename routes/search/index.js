var express = require('express');
var router = express.Router();
var TrunkLib = require('../../lib/mongo')
var db = require('monk')(process.env.MONGOLAB_URI || 'localhost/trunk_swap');
var trunkdb = db.get('trunks');
var usersdb = db.get('users');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('search/index', { title: 'Post Offer', displayName: req.user.displayName })
});

router.post('/', function(req, res, next) {
  TrunkLib.searchForTrunk(req.body)
  .then(function (docs) {
    res.render('search/results', { title: 'Post Offer', displayName:req.user.displayName, allTrunks: docs });
  })
});

router.get('/:id', function(req, res, next) {
  trunkdb.findOne({_id: req.params.id}, function (err, record) {
    res.render('search/show', {theTrunk: record});
  });
});

module.exports = router;
