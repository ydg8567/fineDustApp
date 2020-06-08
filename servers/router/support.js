const express = require('express');
const router = express.Router();

/* GET info page. */
router.get('/', (req, res, next) => {
  res.render('content/support');
})

module.exports = router;
