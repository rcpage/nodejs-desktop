const readline = require('readline'),
      PROGRAM = require('commander'),
      stringArgv = require('string-argv');
      
global.System = require('../../System.js');
using('System.Database.Storage');

//
// Setup
//
PROGRAM
  .version('v0.1.0')
  .description("A database storage engine that supports NoSQL CRUD operations.")
  .arguments('<command.database.collection> [arg1] [arg2]')
  .action(function (query, doc, update, cmd) {
  var args = query.split('.'),
      database = args[1],
      collection = args[2],
      action = args[0],
      pretty = args[3];
  Storage.query('db', database, collection, action, doc, update, function(err, result){
  	var val = [err, result];
    if(pretty == "pretty")
      val = JSON.stringify(val, null, 2);
    console.log(val);
  });
});

PROGRAM.parse(process.argv);


