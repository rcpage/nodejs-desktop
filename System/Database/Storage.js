class Storage {

  static query(){
    this.args = arguments;
    this.dot = System.getModule('dot-object');
    this.argv = System.getModule('optimist').argv;
    this.shell = System.getModule('shelljs');
    this.ObjectId = System.getModule("bson-objectid");
    this.fs = System.getModule('fs');
    this.jsyaml = System.getModule('js-yaml');
    this.projectDir = './';
    this.storage =  this.projectDir + '.storage/';
    var resultHandler = this.args[this.args.length - 1];
    if(typeof resultHandler != "function"){
      resultHandler = null;
    }
    this.log = resultHandler || function(){ return console.log.apply(console, arguments); };

    for(var i=0;i<10;i++){
      global['$'+i] = this.args[i];
    }

    //console.log([$0,$1,$2,$3,$4,$5]);
    
    try {
      switch($0){
        case "debug":
          this.log([$0,$1,$2,$3,$4,$5]);
          break;
        case "api":
          this.log(this.dot.str($1, this.jsyaml.load($2), {}));
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
          if(this.argv.l){
            var path = db ? this.storage + db + '/' : this.storage,
                path = collection ? path + collection + '/' : path,
                err = null,
                results = [];
            if (this.fs.existsSync(path)) {
              var files = this.fs.readdirSync(path);
              var result = {  };
              files.forEach(filename => {
                var record = { name: filename, path: path + filename };
                var records = [];
                if(!collection){
                  records = this.fs.readdirSync(path + filename);
                }
                records = records.length;
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
              this.log(null, result)
            }
          }
          else {
            //log(db, collection, action);
            switch(action){
              case "find":
                this.find(db, collection, this.jsyaml.load(search), (err, results)=>{
                  this.log(err , results);
                });
                break;
              case "add":
                var doc = this.newDocument(search),
                    dest = this.storage + db + '/' + collection + '/';
                this.shell.mkdir('-p', dest);
                this.fs.writeFileSync( dest + doc['_id'], this.pretty(doc));
                this.log(null, `${doc['_id']} has been written to ${dest}`);
                break;
              case "update":
                this.update(db, collection, search, updateDoc);
                break;
              case "delete":
                this.remove(db, collection, this.jsyaml.load(search));
                break;
            }
          }
          break;
      }
    }
    catch(err){
      this.log(err, null);
    }

  }

  static update(db, collection, search, updateDoc){
    this.find(db, collection, this.jsyaml.load(search), (err, results)=>{
      if(err) this.log(err, results);
      else {
        if(results.length > 0) {
          var messages = [];
          for(var i in results){
            var filename =  results[i] ? this.getRecordDir(db, collection) + results[i]['_id']: "";
            if (this.fs.existsSync(filename)) {
              var record = this.readJSON(filename);
              var update = this.jsyaml.load(updateDoc);
              if(update && update != "undefined"){

                //set fields
                for(var field in update['$set']){
                  record[field] = update['$set'][field];
                }
                //delete fields
                for(var field in update['$del']){
                  delete record[field];
                }

                //replace entire document
                if(!update['$set'] && !update['$del']){
                  record = update;
                }

                this.fs.writeFileSync(filename, this.pretty(record));

                messages.push([null, { message: `${filename} has been updated`, update: record }]);
              }
              else {
                messages.push([(`${filename} was not updated`)]);
              }
            }
            else {
              messages.push([(`${filename} does not exist`)]);
            }
          }
          this.log(null, messages);
        }
        else {
          this.log((`No records found`));
        }
      }
    });
  }

  static getRecordDir(db, collection){
    return this.storage + db + '/' + collection + '/'
  }

  static remove(db, collection, argv, cb){
    this.find(db, collection, argv, (err, results)=>{
      if(err) err = { error: err.message, trace: err.stack };
      else {
        if(results.length > 0) {
          var messages = [];
          for(var i in results){
            var filename = results[i] ? this.getRecordDir(db, collection) + results[i]['_id']: "";
            console.log(filename);
            if (this.fs.existsSync(filename)) {
              this.fs.unlinkSync(filename);
              messages.push([null, `${filename} has been deleted`]);
            }
            else {
              messages.push([(`${filename} does not exist`)]);
            }
          }
          this.log(null, messages);
        }
        else {
          this.log((`Record does not exist`));
        }
      }
    });
  }

  static find(db, collection, search, cb){
    var path = this.storage + db + '/' + collection + '/',
        err = null,
        results = [];
    if (this.fs.existsSync(path)) {
      this.fs.readdirSync(path).forEach(filename => {
        var record = JSON.parse(this.fs.readFileSync(path + filename).toString()),
            filterUndefined = search == 'undefined' || search == undefined || search.length==0 || Object.keys(search).length == 0;
        if(search && search['_id'] == record['_id'] || filterUndefined){
          results.push(record);
        }
        else {
          var exactMatch = null, operatorMatch = null, operatorResults = null,
              documentSearchFields = search.$and || search.$or,
              isAND = search.$and != undefined ? true: false,
              isOR = search.$or != undefined ? true: false;

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
                  //log(field , operator);
                  switch(operator){
                    case '>':
                      if(isOR)
                        operatorMatch = record && record[field] > rightSideValue ? true : operatorMatch;
                      else
                        operatorMatch = record && record[field] > rightSideValue;
                      break;
                    case '<':
                      if(isOR)
                        operatorMatch = record && record[field] < rightSideValue ? true : operatorMatch;
                      else
                        operatorMatch = record && record[field] < rightSideValue;
                      break;
                    case '<=':
                      if(isOR)
                        operatorMatch = record && record[field] <= rightSideValue ? true : operatorMatch;
                      else
                        operatorMatch = record && record[field] <= rightSideValue;
                      break;
                    case '>=':
                      if(isOR)
                        operatorMatch = record && record[field] >= rightSideValue ? true : operatorMatch;
                      else
                        operatorMatch = record && record[field] >= rightSideValue;
                      break;
                    case '!=':
                      if(isOR)
                        operatorMatch = record && record[field] != rightSideValue ? true : operatorMatch;
                      else
                        operatorMatch = record && record[field] != rightSideValue;
                      break;
                    case '==':

                      if(isOR)
                        operatorMatch = record && record[field] == rightSideValue ? true : operatorMatch;
                      else
                        operatorMatch = record && record[field] == rightSideValue;
                      break;
                  }
                  operatorResults.push({
                    field: field, 
                    leftSideValue: record[field], 
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
                  exactMatch = record && searchValue == record[field] ? true : exactMatch;
                else
                  exactMatch = record && searchValue == record[field];
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
      if(cb) cb((`${path} does not exist.`), results);
    }
  }

  static pretty(json){
    return JSON.stringify(json, null, 2);
  }

  static readJSON(filename){
    try {
      return JSON.parse(this.fs.readFileSync(filename));
    }
    catch(e){
      return null;
    }
  }

  static newDocument(init){
    var doc = init ? this.jsyaml.load(init) : {},
        id = this.ObjectId(),
        ops = this.getOptions();
    doc['_id'] = id;
    for(var i in ops){
      doc[ops[i].name] = ops[i].value;
    }
    return doc;
  }

  static getOptions(){
    var ops = [];
    for(var i in this.args){
      var o = this.args[i];
      if(!o) continue;
      //make sure args is a string
      if(typeof o.startsWith == "string" && o.startsWith('--')){
        var name = o.substr(2, o.indexOf('=')-2),
            val = o.substr(o.indexOf('=') + 1);
        val = o.indexOf('{{') == -1 ? this.jsyaml.load(val): val;
        var opt = {name: name, value: val };
        //opt[name] = val;
        ops.push(opt);
      }
    } 
    return  ops;
  }

  static hexDecode(str){
    var j;
    var hexes = str.match(/.{1,4}/g) || [];
    var back = "";
    for(j = 0; j<hexes.length; j++) {
      back += String.fromCharCode(parseInt(hexes[j], 16));
    }

    return back;
  }

  static hexEncode(str){
    if(!str) return "";
    var hex, i;
    var result = "";
    for (i=0; i<str.length; i++) {
      hex = str.charCodeAt(i).toString(16);
      result += ("000"+hex).slice(-4);
    }

    return result
  }

}