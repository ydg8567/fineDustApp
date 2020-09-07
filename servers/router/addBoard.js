const express = require('express');
const router = express.Router();
const moment = require('moment');
const connection = require("../connection");            // DB connection by connection.js

// 현 시간을 나타내는 함수
function todayDate(dates) {
    let today = new Date();

    let year = today.getFullYear();
    let month = today.getMonth();
    let date = today.getDate();
    // let day = today.getDay();

    let hours = today.getHours();
    let minutes = today.getMinutes();
    let seconds = today.getSeconds();

    return month + '/' + date + ' ' + hours + ':' + minutes;
}
// 함수의 다른 표현 법(2)
/*const todayDate = (dated) => {
    let today = new Date();

    let year = today.getFullYear();
    let month = today.getMonth();
    let date = today.getDate();
    // let day = today.getDay();

    let hours = today.getHours();
    let minutes = today.getMinutes();
    let seconds - today.getSeconds();

    return month + '/' + date + ' ' + hours + ':' + minutes;
}*/

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
    res.render('content/addBoard');
})

module.exports = router;