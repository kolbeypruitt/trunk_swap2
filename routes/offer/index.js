var express = require('express');
var router = express.Router();
var db = require('monk')(process.env.MONGOLAB_URI || 'localhost/trunk_swap');
var trunkdb = db.get('trunk');
var usersdb = db.get('users');
var Users = require('../../lib/mongo')


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('offer/index', { title: 'Post Offer', displayName: req.user.displayName })
});

module.exports = router;
