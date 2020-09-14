const express = require('express');
const router = express.Router();
const moment = require('moment');
const connection = require("../connection");            // DB connection by connection.js

// 현 시간을 나타내는 함수
function todayDate() {
    let today = new Date();

    let year = today.getFullYear();
    let month = today.getMonth();
    let date = today.getDate();

    let hours = today.getHours();
    let minutes = today.getMinutes();

    return year + '/' + month + '/' + date + ' ' + hours + ':' + minutes;
}

// boardInfo의 객체 선언
const boardInfo = {
    _nums: 1,
    _title: 'test',
    _views: 3,
    _date: todayDate(),
    _autor: 'admin',

    set nums(num) {this._nums = num;},
    set title(title) {this._title = title;}
}

/* GET info page. */
router.get('/', (req, res, next) => {
    const param = req.query;
    const nums = param.nums;

    const query = `
    SELECT autor, title, content, nums
    FROM y_board
    WHERE nums = ${nums}
    `;

    connection.query(query, (err, rows, fields) => {
        if(!err) {
            res.render('content/editBoard', {
                'boardDatas': rows.map(data => {
                    return {
                        nums: data.nums,
                        autor: data.autor,
                        title: data.title,
                        content: data.content
                    }
                })
            });
        } else {
            console.log(err);
            res.render('content/editBoard', err);
        }
    })
})

/* POST info page. */
router.post('/api/edit', (req, res, next) => {
    const param = req.body;

    const passwordCheckQuery = `
    SELECT password 
    FROM y_board
    WHERE nums = ${param.nums}
    `;

    const editQuery = `
    UPDATE y_board SET title = '${param.title}', content = '${param.content}'
    WHERE nums = ${param.nums}
    `;

    connection.query(passwordCheckQuery, function(err, row, fileds) {
        if(!err) {
            if(row[0].password == param.password) {
                connection.query(editQuery, function(err, row, fileds) {
                    if(!err) {
                        res.send("editSuccess");
                    } else {
                        res.send("edit Err: " + err);
                    }
                })
            } else {
                res.send("wrongPassword");
            }
        } else {
            res.send("passwordCheck Err: " + err);
        }
    })
})
module.exports = router;