var express = require('express');
var router = express.Router();

/* GET info page. */
router.get('/', function(req, res, next) {
  res.render('content/info');
});

module.exports = router;
