const express = require('express');
const router = express.Router();
const moment = require('moment');
const connection = require("../connection");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/api/get/chartdata', function(req, res, next) {
  const query = `
    SELECT MAX(pm2_5) AS dust, rgst_dt
    FROM finedust_tb 
    GROUP BY SUBSTR(rgst_dt, 1, 13)
    ORDER BY rgst_dt DESC 
    LIMIT 10`;

  connection.query(query, (err, rows, fields) => {
    if (!err) {
      res.send(rows.length > 0 ? {
        data: rows[0].dust, 
        lineGraphData: rows.map(data => {
          return {'rgstDt': moment(data.rgst_dt).format('MM-DD hh'), 'value': data.dust}
        })
      } : {});
    }
    else {
      console.log(err);
      res.send(err);
    }
  })
});

router.get('/api/get/pm/now', function(req, res, next) {
  const queryForHour = `
    SELECT MAX(pm10_0) AS ultrafineHour, MAX(pm2_5) AS dustHour, SUBSTR(rgst_dt, 6, 13) AS rgstDt  
    FROM finedust_tb 
    WHERE rgst_dt LIKE '${moment().format('YYYY-MM-DD hh')}%'
    GROUP BY SUBSTR(rgst_dt, 1, 13) 
    ORDER BY rgst_dt DESC 
  `;

  const queryForToday = `
    SELECT MAX(pm10_0) AS ultrafineDay, MAX(pm2_5) AS dustDay, SUBSTR(rgst_dt, 6, 13) AS rgstDt 
    FROM finedust_tb 
    WHERE rgst_dt LIKE '${moment().format('YYYY-MM-DD')}%'
    GROUP BY SUBSTR(rgst_dt, 1, 10) 
    ORDER BY rgst_dt DESC 
  `;

  connection.query(queryForHour, (err, rows, fields) => {
    if (!err) {
      const rowsForHour = rows[0];

      connection.query(queryForToday, (err, rows, fields) => {
        if (!err) {
          const rowsForToday = rows[0];
         
          res.send({
            ...rowsForHour,
            ...rowsForToday,
            today: moment().format('YYYY년 MM월 DD일 hh시')
          });
        }
        else {
          console.log(err);
          res.send(err);
        }
      })
    }
    else {
      console.log(err);
      res.send(err);
    }
  })

  // connection.query(queryForToday, (err, rows, fields) => {
  //   if (!err) {
  //     result.set('ultrafineDay', rows.pm10_0)
  //     result.set('dustDay', rows.pm10_0)
  //   }
  //   else {
  //     console.log(err);
  //     res.send(err);
  //   }
  // })
});

module.exports = router;
