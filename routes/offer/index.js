var express = require('express');
var router = express.Router();
var TrunkLib = require('../../lib/mongo')

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('offer/index', { title: 'Post Offer', displayName: req.user.displayName })
});

router.post('/offerIt', function(req, res, next) {
  var body = req.body;
  var user = req.session.passport.user;
  TrunkLib.insertTrunkOffer(body, user)
    res.redirect('/offer/posted')
});

router.get('/posted', function(req, res, next) {
    res.render('offer/index', { title: 'Post Offer', displayName: req.user.displayName })
});

module.exports = router;
