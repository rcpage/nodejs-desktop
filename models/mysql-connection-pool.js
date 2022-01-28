var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit: 100, //important
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS,
  //database : '',
  debug: false,
  multipleStatements: true
});

function handle_database(sql, callback) {
  pool.getConnection(function (err, connection) {
    if (err) {
      if (callback)
        callback(err, { "code": 100, "status": "Error in connection database" });
      return;
    }
    connection.query(sql, function (err, rows, cols) {
      connection.release();
      if (callback) callback(err, rows, cols);
    });
    connection.on('error', function (err) {
      if (callback) callback(err, { "code": 100, "status": "Error in connection database" });
      return;
    });
  });
}

module.exports = handle_database;