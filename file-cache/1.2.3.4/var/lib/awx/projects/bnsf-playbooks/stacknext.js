const args = process.argv.slice(2),
      dot = require('dot-object'),
      argv = require('optimist').argv,
      shell = require('shelljs'),
      ObjectId = require("bson-objectid"),
      fs = require('fs'),
      jsyaml = require('js-yaml'),
      projectDir = './',
      storage =  projectDir + 'storage/',
      log = function(){ return console.log.apply(console, arguments); };

for(var i=0;i<10;i++){
  global['$'+i] = argv._[i];
}
try {
  switch($0){
    case "debug":
      log([$0,$1,$2,$3,$4,$5]);
      break;
    case "api":
      log(dot.str($1, jsyaml.load($2), {}));
      break;
    case "app":
      break;
    case "db":
      var db = $1,
          collection = $2,
          action = $3,
          search = $4,
          updateDoc = $5;
      //list db || volumes
      if(argv.l){
        var path = db ? storage + db + '/' : storage,
            path = collection ? path + collection + '/' : path,
            err = null,
            results = [];
        if (fs.existsSync(path)) {
          var files = fs.readdirSync(path);
          var result = {  };
          files.forEach(filename => {
            var record = { name: filename, path: path + filename };
            var records = [];
            if(!collection){
              records = fs.readdirSync(path + filename);
            }
            record.documents = records.length;
            results.push(record);
          });

          if(db && !collection) {
            result.database = db;
            result.volumes = results;
          }
          else if(db && collection) {
            result.database = db;
            result.volume = collection;
            result.documents = results.length;
          }
          else result.databases = results;


          //result.fullpath = __dirname;
          log(pretty([null, result]))
        }
      }
      else {
        //log(db, collection, action);
        switch(action){
          case "find":
            find(db, collection, jsyaml.load(search), (err, results)=>{
              if(err) err = { error: err.message, trace: err.stack };
              log(pretty([err , results]));
            });
            break;
          case "add":
            var doc = newDocument(search),
                dest = storage + db + '/' + collection + '/';
            shell.mkdir('-p', dest);
            fs.writeFileSync( dest + doc['.id'], pretty(doc));
            log(`${doc['.id']} has been written to ${dest}`);
            break;
          case "update":
            update(db, collection, search, updateDoc);
            break;
          case "delete":
            remove(db, collection, jsyaml.load(search));
            break;
        }
      }
      break;
  }
}
catch(err){
  log(pretty([err.stack, null]));
}


function update(db, collection, search, updateDoc){
  find(db, collection, jsyaml.load(search), (err, results)=>{
    if(err) err = { error: err.message, trace: err.stack };
    else {
      if(results.length > 0) {
        for(var i in results){
          var filename = results[i] ? results[i]['.path']: "";
          if (fs.existsSync(filename)) {
            var record = readJSON(filename);
            var update = jsyaml.load(updateDoc);
            if(update && update != "undefined"){

              //set fields
              for(var field in update['.set']){
                record.document[field] = update['.set'][field];
              }
              //delete fields
              for(var field in update['.del']){
                delete record.document[field];
              }

              //replace entire document
              if(!update['.set'] && !update['.del']){
                record.document = update;
              }

              fs.writeFileSync(filename, pretty(record));

              log(`${filename} has been updated`);
            }
            else {
              log(`${filename} was not updated`);
            }
          }
          else {
            log(`${filename} does not exist`);
          }
        }
      }
      else {
        log(`No records found`);
      }
    }
  });
}

function remove(db, collection, argv, cb){
  find(db, collection, argv, (err, results)=>{
    if(err) err = { error: err.message, trace: err.stack };
    else {
      if(results.length > 0) {
        for(var i in results){
          var filename = results[i] ? results[i]['.path']: "";
          if (fs.existsSync(filename)) {
            fs.unlinkSync(filename);
            log(`${filename} has been deleted`);
          }
          else {
            log(`${filename} does not exist`);
          }
        }
      }
      else {
        log(`Record does not exist`);
      }
    }
  });
}

function find(db, collection, search, cb){
  var path = storage + db + '/' + collection + '/',
      err = null,
      results = [];
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(filename => {
      var record = JSON.parse(fs.readFileSync(path + filename).toString());
      record['.path'] = path + filename;
      if(search && search['.id'] == record['.id'] || search == undefined){
        results.push(record);
      }
      //log(filename, 'search=', search);
      if(search && search.document){

        var exactMatch = null, operatorMatch = null, operatorResults = null,
            documentSearchFields = search.document.AND || search.document.OR,
            isAND = search.document.AND != undefined ? true: false,
            isOR = search.document.OR != undefined ? true: false;

        if(documentSearchFields){
          
          operatorResults = [];
          
          for(var field in documentSearchFields){

            var searchValue = documentSearchFields[field];
            //check if search value is object with operators
            if(typeof searchValue == "object"){
             
              //search for operators
              for(var operator in searchValue){
                //assign value to compare
                var rightSideValue = searchValue[operator];
                //find documents satisfying comparison
                //OR operator: only update if true; otherwise, keep original value
                
                switch(operator){
                  case '>':
                    if(isOR)
                      operatorMatch = record.document && record.document[field] > rightSideValue ? true : operatorMatch;
                    else
                      operatorMatch = record.document && record.document[field] > rightSideValue;
                    break;
                  case '<':
                    if(isOR)
                      operatorMatch = record.document && record.document[field] < rightSideValue ? true : operatorMatch;
                    else
                      operatorMatch = record.document && record.document[field] < rightSideValue;
                    break;
                  case '<=':
                    if(isOR)
                      operatorMatch = record.document && record.document[field] <= rightSideValue ? true : operatorMatch;
                    else
                      operatorMatch = record.document && record.document[field] <= rightSideValue;
                    break;
                  case '>=':
                    if(isOR)
                      operatorMatch = record.document && record.document[field] >= rightSideValue ? true : operatorMatch;
                    else
                      operatorMatch = record.document && record.document[field] >= rightSideValue;
                    break;
                  case '!=':
                    if(isOR)
                      operatorMatch = record.document && record.document[field] != rightSideValue ? true : operatorMatch;
                    else
                      operatorMatch = record.document && record.document[field] != rightSideValue;
                    break;
                  case '==':
                    if(isOR)
                      operatorMatch = record.document && record.document[field] == rightSideValue ? true : operatorMatch;
                    else
                      operatorMatch = record.document && record.document[field] == rightSideValue;
                    break;
                }
                operatorResults.push({
                  field: field, 
                  leftSideValue: record.document[field], 
                  rightSideValue: rightSideValue, 
                  isOR: isOR, 
                  isAND: isAND,
                  match: operatorMatch
                });
              }
              
              
            } 
            else {
              //
              //find exact match to field
              //
              if(isOR)
                exactMatch = record.document && searchValue == record.document[field] ? true : exactMatch;
              else
                exactMatch = record.document && searchValue == record.document[field];
            }
          }
          
          //log(operatorResults);
          //process results
          var processedResult = null;
          for(var i in operatorResults){
            if(isOR)
              processedResult = operatorResults[i].match ? true : processedResult;
            else
              processedResult = operatorResults[i].match;
          }
          operatorMatch = processedResult;
          //
          //add to record to results
          //
          if(exactMatch && operatorMatch) results.push(record);
          else if(exactMatch && operatorMatch === null) results.push(record);
          else if(exactMatch === null && operatorMatch) results.push(record);
        }
        //end search results
      }
    });
    //
    // return results
    //
    if(cb) cb(err, results);
  }
  else {
    if(cb) cb(new Error(`${path} does not exist.`), results);
  }
}

function pretty(json){
  return JSON.stringify(json, null, 2);
}

function readJSON(filename){
  try {
    return JSON.parse(fs.readFileSync(filename));
  }
  catch(e){
    return null;
  }
}

function newDocument(init){
  var doc = init ? jsyaml.load(init) : {},
      id = ObjectId(),
      ops = getOptions();
  for(var i in ops){
    doc[ops[i].name] = ops[i].value;
  }
  return { '.id': id, document: doc };
}

function getOptions(){
  var ops = [];
  for(var i in args){
    var o = args[i];
    if(o.startsWith('--')){
      var name = o.substr(2, o.indexOf('=')-2),
          val = o.substr(o.indexOf('=') + 1);
      val = o.indexOf('{{') == -1 ? jsyaml.load(val): val;
      var opt = {name: name, value: val };
      //opt[name] = val;
      ops.push(opt);
    }
  } 
  return  ops;
}

function hexDecode(str){
  var j;
  var hexes = str.match(/.{1,4}/g) || [];
  var back = "";
  for(j = 0; j<hexes.length; j++) {
    back += String.fromCharCode(parseInt(hexes[j], 16));
  }

  return back;
}

function hexEncode(str){
  if(!str) return "";
  var hex, i;
  var result = "";
  for (i=0; i<str.length; i++) {
    hex = str.charCodeAt(i).toString(16);
    result += ("000"+hex).slice(-4);
  }

  return result
}