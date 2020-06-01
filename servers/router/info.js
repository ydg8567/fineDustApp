const express = require('express');
const router = express.Router();
const moment = require('moment');
const connection = require("../connection");

/* GET info page. */
router.get('/', (req, res, next) => {
  const query = `SELECT * FROM finedust_tb ORDER BY rgst_dt DESC LIMIT 30`;

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
  const query = `SELECT * FROM finedust_tb ORDER BY rgst_dt DESC LIMIT 30`;

  connection.query(query, (err, rows, fields) => {
    if (!err) {
      let result;

      rows.forEach(data => {
        const html = `
          <tr>
            <td>${data.log_idx}</td>
            <td>${data.A1}</td>
            <td>${data.temperature}</td>
            <td>${data.freqeuncy}</td>
            <td>${data.rgst_dt}</td>
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
