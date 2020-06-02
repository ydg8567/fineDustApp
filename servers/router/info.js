const express = require('express');
const router = express.Router();
const moment = require('moment');
const connection = require("../connection");

/* GET info page. */
router.get('/', (req, res, next) => {
  const query = `
    SELECT MAX(dust) AS dust, MAX(ultrafine) AS ultrafine, rgst_dt 
    FROM finedust_tb 
    GROUP BY SUBSTR(rgst_dt, 1, 13) 
    ORDER BY rgst_dt DESC LIMIT 30
  `;

  connection.query(query, (err, rows, fields) => {
    if (!err) {
      res.render('content/info', {'datas': rows.map(data => {
                                            return {
                                              dust: data.dust,
                                              ultrafine: data.ultrafine,
                                              rgst_dt: moment(data.rgst_dt).format('MM-DD:hh')
                                            }
                                          })
                                  });
    }
    else {
      console.log(err);
      res.render('content/info', err);
    }
  })
})

router.get('/api/search', (req, res, next) => {
  const params = req.query;
  const start = moment(`${params.startDate}T${params.startTime}:00:00+00:00`).format('YYYY-MM-DD hh:mm:ss');
  const end = moment(`${params.endDate}T${params.endTime}:00:00+00:00`).format('YYYY-MM-DD hh:mm:ss');
  
  const query = `
    SELECT MAX(dust) AS dust, MAX(ultrafine) AS ultrafine, rgst_dt 
    FROM finedust_tb WHERE rgst_dt >= '${start}' AND rgst_dt <= '${end}' 
    GROUP BY SUBSTR(rgst_dt, 1, ${params.time}) 
    ORDER BY rgst_dt DESC 
    LIMIT 30
  `;

  connection.query(query, (err, rows, fields) => {
    if (!err) {
      let result;

      rows.forEach(data => {
        const html = `
          <tr>
            <td>${moment(data.rgst_dt).format(params.time === '13' ? 'MM-DD:hh' : 'MM-DD')}</td>
            <td class="${data.dust > 33 ? 'green' : 'blue'}">●</td>
            <td>${data.dust}</td>
            <td class="${data.ultrafine > 12 ? 'green' : 'blue'}">●</td>
            <td>${data.ultrafine}</td>
          </tr>
        `
        result += html;
      });
      res.send(result);
    }
    else {
      console.log(err);
      res.send(err);
    }
  })
})

module.exports = router;
