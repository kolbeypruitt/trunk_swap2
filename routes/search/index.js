var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('search/index', { title: 'Post Offer', displayName: req.user.displayName })
});

module.exports = router;
