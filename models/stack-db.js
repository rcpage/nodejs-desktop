const ObjectId = require("bson-objectid"),
      shelljs = require('shelljs');
var model = {};
model.db = {
  ObjectId : ObjectId,
  collections : {
    insert: function(db, collection, doc){
      	var cmd = ['stack db', db, collection, 'add', "'"+JSON.stringify(doc)+"'"].join(' ');
    	console.log( cmd, shelljs.exec(cmd) );
    },
    search: function(){},
    delete: function(){},
    count : function(){},
    update: function(){},
    show : function(){}
  }
}
module.exports = model;