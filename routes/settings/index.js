var express = require('express');
var router = express.Router();


router.get('/', function (req, res, next) {
  res.render('settings/index', {title: 'User Settings'
                          , email: req.user.email
                          , firstName: req.user.firstName
                          , lastName: req.user.lastName
                          , displayName: req.user.displayName
                          , profilePic: req.user.profilePic });
});

router.get('/edit', function (req, res, next) {
  res.redirect('/settings')
});

router.get('/close', function (req, res, next) {
  res.redirect('/');
});

module.exports = router;
