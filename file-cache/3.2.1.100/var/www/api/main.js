var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'rpadmin',
  database : 'pcb-parts-db'
});
 
connection.connect();
var interface_id = 4;
connection.query("CALL getInterfaceSignals(?)", interface_id, function (error, results, fields) {
  if (error) throw error;
  console.log(JSON.stringify(results,null,2));
 });
connection.end();
