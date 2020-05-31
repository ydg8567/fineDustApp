var express = require('express');
var router = express.Router();
const connection = require("../connection");

/* GET info page. */
router.get('/', (req, res, next) => {
  const query = `SELECT * FROM gas_log_tb WHERE module_idx = 2 LIMIT 30`;

  connection.query(query, (err, rows, fields) => {
    if (!err) {
      res.render('content/info', {'datas': rows});
    }
    else {
      console.log(err);
      res.render('content/info', err);
    }
  })
})

module.exports = router;
