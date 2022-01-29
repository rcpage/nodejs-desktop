var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient
var mongoDb = 'mongodb://localhost:27017/';
var ObjectId = mongodb.ObjectId;
var model = {};

function dbConnect(callback) {
  //DeprecationWarning: current URL string parser is deprecated, 
  //and will be removed in a future version. To use the new parser, 
  //pass option { useNewUrlParser: true } to MongoClient.connect.
  MongoClient.connect(mongoDb, { useNewUrlParser: true }, function (err, client) {
    try {
      var db = client.db('test');
      if (callback) callback(err, client, db);
    } catch (e) {
      if (callback) callback(e, client, {});
    }
  });
}

function showCollections(db, callback) {
  //callback(null, db.collectionNames);
  db.listCollections().toArray(function (err, collections) {
    if (callback) callback(err, collections);
  });
}

function insertCollection(name, db, params, callback) {
  var collection = db.collection(name);
  if (collection) {
    collection.insert(params, function (err, result) {
      if (callback) callback(err, result);
    });
  }
}

function updateCollection(name, db, params, update, callback) {
  var collection = db.collection(name);
  if (collection) {
    collection.update(params, update, { multi: true }, function (err, result) {
      if (callback) callback(err, result);
    });
  }
}

function removeCollection(name, db, params, callback) {
  var collection = db.collection(name);
  if (collection) {
    collection.remove(params, function (err, result) {
      if (callback) callback(err, result);
    });
  }
}

function findCollection(name, db, params, callback, options, sort) {
  var collection = db.collection(name);
  if (collection) {
    let find = null;
    if (options) {
      find = sort ? collection.find(params, options).sort(sort) : collection.find(params, options);
    }
    else {
      find = sort ? collection.find(params).sort(sort) : collection.find(params);
    }
    find.toArray(function (err, result) {
      if (callback) callback(err, result);
    });
  }
}

function countCollection(name, db, params, callback) {
  var collection = db.collection(name);
  if (collection) {
    collection.count(params, function (err, result) {
      if (callback) callback(err, result);
    });
  }
}

function dbRemoveCollection(name, params, callback) {
  // Use connect method to connect to the server
  dbConnect(function (dbError, client, db) {
    if (dbError) {
      if (callback) callback(dbError, db);
      client.close();
      return;
    }
    removeCollection(name, db, params, function (err, result) {
      if (callback) callback(err, result);
      client.close();
    });
  });
}

function dbShowCollections(callback) {
  // Use connect method to connect to the server
  dbConnect(function (dbError, client, db) {
    if (dbError) {
      if (callback) callback(dbError, db);
      client.close();
      return;
    }
    showCollections(db, function (err, result) {
      if (callback) callback(err, result);
      client.close();
    });
  });
}

function dbFindCollection(name, params, callback, options, sort) {
  // Use connect method to connect to the server
  dbConnect(function (dbError, client, db) {
    if (dbError) {
      if (callback) callback(dbError, db);
      if (client) client.close();
      return;
    }
    findCollection(name, db, params, function (err, result) {
      if (callback) callback(err, result);
      client.close();
    }, options, sort);
  });
}

function dbInsertCollection(name, params, callback) {
  // Use connect method to connect to the server
  dbConnect(function (dbError, client, db) {
    if (dbError) {
      if (callback) callback(dbError, db);
      client.close();
      return;
    }
    insertCollection(name, db, params, function (err, result) {
      if (callback) callback(err, result);
      client.close();
    });
  });
}

function dbUpdateCollection(name, params, update, callback) {
  // Use connect method to connect to the server
  dbConnect(function (dbError, client, db) {
    if (dbError) {
      if (callback) callback(dbError, db);
      client.close();
      return;
    }
    updateCollection(name, db, params, update, function (err, result) {
      if (callback) callback(err, result);
      client.close();
    });
  });
}

function dbCountCollection(name, params, callback) {
  // Use connect method to connect to the server
  dbConnect(function (dbError, client, db) {
    if (dbError) {
      if (callback) callback(dbError, db);
      client.close();
      return;
    }
    countCollection(name, db, params, function (err, result) {
      if (callback) callback(err, result);
      client.close();
    });
  });
}

model.db = {
  ObjectId: ObjectId,
  collections: {
    insert: dbInsertCollection,
    search: dbFindCollection,
    delete: dbRemoveCollection,
    count: dbCountCollection,
    update: dbUpdateCollection,
    show: dbShowCollections
  }
}
module.exports = model;












