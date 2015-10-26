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
  var trunkParams = req.body;
  var user = req.session.passport.user;
  // TrunkLib.searchForTrunk(trunkParams, user).then(function (searchResults) {
  //   res.render('search/results', { title: 'Post Offer', allTrunks: searchResults });
  // })
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
      res.render('search/results', { title: 'Post Offer', allTrunks: docs });
    })
    

  // return trunkdb.find({
  //   "$text": {
  //     "$search": req.body.query
  //   }}).then(function (searchResults) {
  //     console.log(searchResults);
  //     res.render('search/results', { title: 'Post Offer', allTrunks: searchResults });
  //   })
});

router.get('/results', function(req, res, next) {
  res.render('search/results', { title: 'Post Offer', results: records });
});

module.exports = router;
