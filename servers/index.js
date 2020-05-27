var express = require('express');
var router = express.Router();
var moment = require('moment');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/api/get/chartdata', function(req, res, next) {
  res.send({today: moment().format('YYYY년 MM월 DD일 hh시'),
                       dustHour: 33,
                       dustDay: 31,
                       ultrafineHour: 13,
                       ultrafineDay: 11,
                       data: 30, 
                       lineGraphData: [
                                        {'rgstDt': '2020-05-25 14:11:00', 'value': 25},
                                        {'rgstDt': '2020-05-25 14:12:00', 'value': 35},
                                        {'rgstDt': '2020-05-25 14:13:00', 'value': 45},
                                        {'rgstDt': '2020-05-25 14:14:00', 'value': 35},
                                        {'rgstDt': '2020-05-25 14:15:00', 'value': 25},
                                        {'rgstDt': '2020-05-25 14:16:00', 'value': 35},
                                        {'rgstDt': '2020-05-25 14:17:00', 'value': 45},
                                        {'rgstDt': '2020-05-25 14:18:00', 'value': 35},
                                        {'rgstDt': '2020-05-25 14:19:00', 'value': 25},
                                        {'rgstDt': '2020-05-25 14:20:00', 'value': 35},
                                      ]});
});

module.exports = router;
