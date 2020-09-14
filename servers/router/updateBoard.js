const express = require('express');
const router = express.Router();
const moment = require('moment');
const connection = require("../connection");            // DB connection by connection.js

/* GET info page. */
router.get('/', (req, res, next) => {
    const param = req.query;
    const nums = param.nums;

    const query = `
    SELECT autor, title, content, nums
    FROM y_board
    WHERE nums = ${nums}
    `;

    const increaseViewQuery = `
    UPDATE y_board SET views = views + 1
    WHERE nums = ${nums}
    `;

    connection.query(query, (err, rows, fields) => {
        if(!err) {
            connection.query(increaseViewQuery, function(err, row, fields) {
                if(!err) {
                    console.log("viewIncrease");
                } else {
                    console.log("viewIncreaseErr");
                }
            })

            res.render('content/updateBoard', {
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
            res.render('content/updateBoard', err);
        }
    })
})

/* POST info page. */
router.post('/api/delete', (req, res, next) => {
    const param = req.body;

    const deleteQuery = `
    DELETE FROM y_board
    WHERE nums = ${param.nums}
    `;

    connection.query(deleteQuery, function(err, row, fileds) {
        if(!err) {
            res.send("deleteSuccess");
        } else {
            res.send("delete Err: " + err);
        }
    })
})

/* POST info page. */
router.post('/api/passwordCheck', (req, res, next) => {
    const param = req.body;

    const passwordCheckQuery = `
    SELECT password 
    FROM y_board
    WHERE nums = ${param.nums}
    `;

    connection.query(passwordCheckQuery, function(err, row, fileds) {
        if(!err) {
            if(row[0].password == param.password) {
                res.send("correctPassword");
            } else {
                res.send("wrongPassword");
            }
        } else {
            res.send("passwordCheck Err: " + err);
        }
    })
})
module.exports = router;