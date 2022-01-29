var mysql = require('mysql');

var connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS,
})
connection.connect(err => {
  if (err) throw err;
  var sql = "show databases;";
  console.log('Connection successful.');
  connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Result: ", result);
    connection.end();
  });
});
