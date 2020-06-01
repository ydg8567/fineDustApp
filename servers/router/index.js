const express = require('express');
const router = express.Router();
const moment = require('moment');
const connection = require("../connection");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/api/get/chartdata', function(req, res, next) {
  const query = `SELECT * FROM finedust_tb ORDER BY rgst_dt DESC LIMIT 10`;

  connection.query(query, (err, rows, fields) => {
    if (!err) {
      res.send({
                  today: moment().format('YYYY년 MM월 DD일 hh시'),
                  dustHour: 33,
                  dustDay: 31,
                  ultrafineHour: 13,
                  ultrafineDay: 11,
                  data: rows[0].ultrafine, 
                  lineGraphData: rows.map(data => {
                    return {'rgstDt': moment(data.rgst_dt).format('YYYY-MM-DD hh:mm'), 'value': data.ultrafine}
                  })
                });
    }
    else {
      console.log(err);
      res.send(err);
    }
  })
});

module.exports = router;
