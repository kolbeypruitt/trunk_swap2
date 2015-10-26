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
  console.log(req.body);
  var obj = {}
  if(req.body.findYear!='null') {
      obj['current_year'] = req.body.findYear;
  }
  if(req.body.findModel!='null') {
      obj['current_model'] = req.body.findModel;
  }
  if(req.body.findStyle!='null') {
      obj['current_style'] = req.body.findStyle;
  }
  trunkdb.find(obj, function(err, docs){
      if (err) return err;
      // console.log(docs);
      // res.send(docs);
  }).then(function (docs) {
    res.render('search/results', { title: 'Post Offer', displayName:req.user.displayName, allTrunks: docs });
  })
});

router.get('/:id', function(req, res, next) {
  trunkdb.findOne({_id: req.params.id}, function (err, record) {
    res.render('search/show', {theTrunk: record});
  });
});

module.exports = router;
