const mysql = require("mysql");
const connection = mysql.createConnection({
  host: '112.185.161.246',
  port: 23306,
  user: 'root',
  password: 'ubimicro',
  database: 'devrtengm'
})

module.exports = connection;