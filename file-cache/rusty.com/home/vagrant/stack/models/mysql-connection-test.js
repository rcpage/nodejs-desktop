var mysql = require('mysql');

var connection = mysql.createConnection({
  host:'192.168.1.154',
  user:'root', 
  password:'rpadmin'
})
connection.connect( err => {
  if(err) throw err;
  var sql = "show databases;";
  console.log('Connection successful.');
  connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Result: " , result);
    connection.end();
  });
});
