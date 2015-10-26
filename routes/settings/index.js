var express = require('express');
var router = express.Router();
var TrunkLib = require('../../lib/mongo')
var db = require('monk')(process.env.MONGOLAB_URI || 'localhost/trunk_swap');
var trunkdb = db.get('trunks');
var usersdb = db.get('users');

router.get('/', function (req, res, next) {
  res.render('settings/index', {title: 'User Settings'
                          , email: req.user.email
                          , firstName: req.user.firstName
                          , lastName: req.user.lastName
                          , displayName: req.user.displayName
                          , profilePic: req.user.profilePic
                          , phone: req.user.phone });
});

router.get('/edit', function (req, res, next) {
  res.render('settings/edit', {title: 'User Settings'
                          , email: req.user.email
                          , firstName: req.user.firstName
                          , lastName: req.user.lastName
                          , displayName: req.user.displayName
                          , profilePic: req.user.profilePic
                          , phone: req.user.phone });
});

router.post('/edit', function (req, res, next) {
  return usersdb.update({_id: req.user._id }, { $set: {phone: req.body.phone}}).then(function () {
    res.redirect('/settings')
  })
})
router.get('/close', function (req, res, next) {
  res.redirect('/');
});

module.exports = router;
