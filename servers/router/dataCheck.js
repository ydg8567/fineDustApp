const express = require('express');
const router = express.Router();
const moment = require('moment');
const connection = require("../connection");

const getDustStatus = (value) => {
    if (value <= 30) {
        return 'blue'
    }
    else if (value > 30 && value <= 80) {
        return 'green'
    }
    else if (value > 80 && value <= 150) {
        return 'yellow'
    }
    else if (value > 150 && value <= 600) {
        return 'red'
    }
    else {
        return 'blue'
    }
}
const getUltraFineDustStatus = (value) => {
    if (value <= 15) {
        return 'blue'
    }
    else if (value > 15 && value <= 35) {
        return 'green'
    }
    else if (value > 35 && value <= 75) {
        return 'yellow'
    }
    else if (value > 75 && value <= 500) {
        return 'red'
    }
    else {
        return 'blue'
    }
}
const conditionQuery = (req_Obj) => {
    const param = req_Obj;
    const kind = param.kind;
    const year = param.year;
    const month = param.month;
    const quarter = param.quarter;
    const week = param.week;
    const start = `${param.startDate} ${param.startTime}:00:00`;
    const end = `${param.endDate} ${param.endTime}:00:00`;

    switch (kind) {
        case "custom":
            return `WHERE rgst_dt BETWEEN '${start}' AND '${end}'`;
            break;
        case "year":
            return `WHERE year(rgst_dt) = ${year}`;
            break;
        case "quarter":
            return `WHERE year(rgst_dt) = ${year} AND quarter(rgst_dt) = ${quarter}`;
            break;
        case "month":
            return `WHERE year(rgst_dt) = ${year} AND month(rgst_dt) = ${month}`;
            break;
        case "week":
            return `WHERE year(rgst_dt) = ${year} AND month(rgst_dt) = ${month} 
                    AND (WEEK(rgst_dt) - WEEK("${year}-${month}-01") + 1) = ${week}`
        default:
            console.log("conditionQueryErr");
    }
}
const tableQuery = (req_Obj, data) => {
    let query;
    if(data == 1) {
        query = ``;
    } else {
        query = conditionQuery(req_Obj);
    }

    return `
    SELECT MAX(pm10_0) AS dust,
           MAX(pm2_5) AS ultrafine,
           AVG(windDirection) AS windDirection,
           ROUND(AVG(substr(windSpeed, 1, 3)), 2) AS windSpeed,
           ROUND(AVG(temperature), 1) As temperature,
           ROUND(AVG(humidity), 1) AS humidity,
           rgst_dt
    FROM finedust_tb ${query}
    GROUP BY SUBSTR(rgst_dt, 1, 10)
    ORDER BY rgst_dt DESC
  `;
}
const statsQuery = (req_Obj, data) => {
    let query;
    if(data == 1) {
        query = ``;
    } else {
        query = conditionQuery(req_Obj);
    }

    return `
    SELECT * FROM (
        SELECT COUNT(*) AS stats FROM (
            SELECT * FROM finedust_tb ${query} GROUP BY SUBSTR(rgst_dt, 1, 10) HAVING MAX(PM10_0) <= 30)a union all
        SELECT COUNT(*) AS cnt FROM (
            SELECT * FROM finedust_tb ${query} GROUP BY SUBSTR(rgst_dt, 1, 10) HAVING MAX(PM10_0) > 30 AND MAX(PM10_0) <= 80)b union all
        SELECT COUNT(*) AS cnt FROM (
            SELECT * FROM finedust_tb ${query} GROUP BY SUBSTR(rgst_dt, 1, 10) HAVING MAX(PM10_0) > 80 AND MAX(PM10_0) <= 150)c union all
        SELECT COUNT(*) AS cnt FROM (
            SELECT * FROM finedust_tb ${query} GROUP BY SUBSTR(rgst_dt, 1, 10) HAVING MAX(PM10_0) > 150)d union all
        SELECT COUNT(*) AS cnt FROM (
            SELECT * FROM finedust_tb ${query} GROUP BY SUBSTR(rgst_dt, 1, 10) HAVING MAX(PM2_5) <= 15)e union all
        SELECT COUNT(*) AS cnt FROM (
            SELECT * FROM finedust_tb ${query} GROUP BY SUBSTR(rgst_dt, 1, 10) HAVING MAX(PM2_5) > 15 AND MAX(PM2_5) <= 35)f union all
        SELECT COUNT(*) AS cnt FROM (
            SELECT * FROM finedust_tb ${query} GROUP BY SUBSTR(rgst_dt, 1, 10) HAVING MAX(PM2_5) > 35 AND MAX(PM2_5) <= 75)g union all
        SELECT COUNT(*) AS cnt FROM (
            SELECT * FROM finedust_tb ${query} GROUP BY SUBSTR(rgst_dt, 1, 10) HAVING MAX(PM2_5) > 78)h
    )t`;
}
/* GET info page. */
router.get('/', (req, res, next) => {
    let initData;

    connection.query(statsQuery(res.query, 1), function(err, rows, fields) {
        if(!err) {
            initData = rows;
        } else {
            console.log(err);
            res.render('content/dataCheck', err);
        }
    })

    connection.query(tableQuery(req.query, 1), (err, rows, fields) => {
        if (!err) {
            res.render('content/dataCheck', {'datas': rows.map(data => {
                    return {
                        dust: data.dust,
                        dustStatus: getDustStatus(data.dust),
                        ultrafine: data.ultrafine,
                        ultrafineStatus: getUltraFineDustStatus(data.ultrafine),
                        windDirection: data.windDirection,
                        windSpeed: data.windSpeed,
                        temperature: data.temperature,
                        humidity: data.humidity,
                        rgst_dt: moment(data.rgst_dt).format('YYYY-MM-DD')
                    }
                }), 'initData': initData
            });
        }
        else {
            console.log(err);
            res.render('content/dataCheck', err);
        }
    })
})

router.get('/api/search', (req, res, next) => {
    connection.query(tableQuery(req.query, 0), (err, rows, fields) => {
        if (!err) {
            let result;

            rows.forEach(data => {
                const html = `
                    <tr>
                        <td>${moment(data.rgst_dt).format('YYYY-MM-DD')}</td>
                        <td class="${getDustStatus(data.dust)}">●</td>
                        <td>${data.dust}</td>
                        <td class="${getUltraFineDustStatus(data.ultrafine)}">●</td>
                        <td>${data.ultrafine}</td>
                        <td>
                            <img class="wind-direction-icon" src="images/arrow-icon.png" alt="wind-direction" style="width: 40px; transform: rotate(${data.windDirection}deg);" />
                        </td>
                        <td>${data.windSpeed} (m/s)</td>
                        <td>${data.temperature} °C</td>
                        <td>${data.humidity} %</td>
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
router.get('/api/stats', (req, res, next) => {
    connection.query(statsQuery(req.query, 0), function (err, rows, fileds) {
        if(!err) {
            const html = `
                <tr>
                    <td>${rows[0].stats} 회</td>
                    <td>${rows[1].stats} 회</td>
                    <td>${rows[2].stats} 회</td>
                    <td>${rows[3].stats} 회</td>
                </tr>
                <tr>
                    <td>${rows[4].stats} 회</td>
                    <td>${rows[5].stats} 회</td>
                    <td>${rows[6].stats} 회</td>
                    <td>${rows[7].stats} 회</td>
                </tr>
            `

            res.send(html);
        } else {
            console.log(err);
            res.send(err);
        }
    })
})

module.exports = router;