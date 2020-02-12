var express = require('express')
var app = express()
app.use(express.urlencoded())
var mysql      = require('mysql');
var pool = mysql.createPool({
  host     : 'localhost',
  user     : 'root',
  password : 'rpadmin',
  database : 'pcb-parts-db',
  connectionLimit : 100, //important
  multipleStatements: true
});

function query(sql, callback){
  pool.getConnection(function(err,connection){
    if (err) {
      if(callback) 
        callback(err, {"code" : 100, "status" : "Error in connection database"});
      return;
    }
    connection.query(sql, function(err, rows, cols){
      connection.release();
      if(callback) callback(err, rows, cols);
    });
    connection.on('error', function(err) {      
      if(callback) callback(err, {"code" : 100, "status" : "Error in connection database"});
      return;     
    });
  });
}

function isFunction(functionToCheck) {
  return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}


function getDeviceFootprints(device_id, cb){
  var numberColumn = ", if(POSITION(']' IN `signal`) - POSITION('[' IN `signal`) - 1 > 0, substr(`signal`, POSITION('[' IN `signal`) + 1, POSITION(']' IN `signal`) - POSITION('[' IN `signal`) - 1), '-1') as number";
  query("select *" + numberColumn + " from device_footprint where device_id = " + device_id + ' ORDER BY CAST(`number` as signed) ASC', function (error, results, fields) {
    if(cb) cb(error, results, fields);
  });
}


function getDeviceBallSignalMap(device_id, cb){
  query("select * from device_ball_signal_map where device_id = " + device_id, function (error, results, fields) {
    if(cb) cb(error, results, fields);
  });
}

function getDevices(cb){
  query("select * from device ORDER BY device_name ASC", function (error, results, fields) {
    for(var i in results){
      results[i].DT_RowId = results[i].device_id;
    }
    if(cb) cb(error, results, fields);
  });
}

function addDevices(device_name, cb){
  query("INSERT INTO device (`device_id`, `device_name`) VALUES (NULL, '"+device_name+"');", function (error, results, fields) {
    if(cb) cb(error, results, fields);
  });
}

function addInterface(device_id, interface_name, cb){
  query("INSERT INTO `interfaces` (`interface_id`, `device_id`, `interface_name`) VALUES (NULL, '"+device_id+"', '"+interface_name+"');", function (error, results, fields) {
    if(cb) cb(error, results, fields);
  });
}

function addInterfaceSignal(interface_id, signalObject, cb){
  var values = [];
  for(var key in signalObject) {
    if(key == 'signal_id') values.push('NULL');
    else values.push("'"+signalObject[key]+"'");
    
  }
  var insertSQL = "INSERT INTO `signals` ("+Object.keys(signalObject).join(',')+") VALUES ("+values.join(",")+");";
  query(insertSQL, function (error, results, fields) {

    if(cb) cb(error, results, fields); 

  });
}

function getInterfaceSignals(interface_id, cb){
  query("select * from device_signal where device_signal.interface_id = "+interface_id, function (error, results, fields) {
    for(var i in results){
		results[i].DT_RowId = results[i].signal_id;
    }
    if(cb) cb(error, results, fields);
  });
}


function getInterfaceNames(device_id, cb){
  query("select * from device_interface where device_id = " + device_id, function (error, results, fields) {
    for(var i in results){
		results[i].DT_RowId = results[i].interface_id;
    }
    if(cb) cb(error, results, fields);
  });
}

function copyInterfaceSignals(src_interface_id, dest_interface_id, cb){
  var copy_cols = 'name, description, channels, ext_res_pu_pd, interface_id, int_res_pu_pd, io_buffer_type, io_type, power_rail';
  var sql = 'select '+copy_cols+' from device_signal where interface_id = ' + src_interface_id;
  query(sql, function (error, results, fields) {
    if(!error){
      var insertSql = '';
      for(var i in results){
        results[i].interface_id = dest_interface_id;
        var keys = Object.keys(results[i]), values = [];
/*
        if(results[i].channels > 1){
          var channels = results[i].channels;
          results[i].channels = 1;
          for(var j=0;j<channels;j++){
            values = [];
            for(var k in keys){
              if(keys[k] == "name"){
                var name = results[i][keys[k]];
                results[i][keys[k]] = name.substr(0, name.indexOf('['))+ '[' + j +']';
              }
              values.push("'" + results[i][keys[k]].toString().replace(/'/g,"\\'") + "'");
            }
            insertSql += 'insert into signals('+keys.join(',')+') values('+values.join(',')+');\n'
          }
        } 
        else {
*/
          for(var k in keys){
            values.push("'" + results[i][keys[k]].toString().replace(/'/g,"\\'") + "'");
          }
          insertSql += 'insert into signals('+keys.join(',')+') values('+values.join(',')+');\n'

        //}
      }
      //console.log(insertSql)
      query(insertSql, function (error2, results2, fields2) {
        if(cb) cb(error2, results2, fields2);
      });
    }
    
  });
}

function removeInterfaceSignal(src_interface_id, signal_id, cb){
  query(`delete from device_signal where signal_id = ${signal_id} AND interface_id = ${src_interface_id};`, function (error, results, fields) {
    if(cb) cb(error, results, fields);
  });
}

function getDeviceSignals(device_id, cb){
  query(`SELECT * FROM device_signal where interface_id IN (SELECT interface_id from device_interface where device_id = ${device_id});`, function (error, results, fields) {
    if(cb) cb(error, results, fields);
  });
}

function updateSignal(signal, cb){
  var set = [];
  for(var col in signal){
	set.push(col + ` = '${signal[col]}'`)
  }
  var values = 'set ' + set.join(',');
  query(`update device_signal ${values} where signal_id = ${signal.signal_id};`, function (error, results, fields) {
    if(cb) cb(error, results, fields);
  });
}

function getDeviceSignalBalls(device_id, cb){
  query(`SELECT * FROM device_ball_signal_map where device_id = ${device_id};`, function (error, results, fields) {
    if(cb) cb(error, results, fields);
  });
}

function send_json(res, obj){
  res.setHeader("content-type", "application/json");
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.end(JSON.stringify(obj, null, 2));
}

function lookupSignal(signalName, signalBallMap){
  for(var i in signalBallMap){
    var ballInfo = signalBallMap[i];
    if(signalName == ballInfo.signal || signalName == ballInfo.signal + "_" + ballInfo.ball){
      return ballInfo;
    }
  }
  return null;
}

app.get('/api/device/signals', function (req, res) {
  var device_id = req.query.id;
  getDeviceSignalBalls(device_id, function(err0, signalBallMap, signalBallMapFields){
    getDeviceSignals(device_id, function(err, result, fields){
      //generate netlist
      for(var i in result){
        var signal = result[i];
        signal.signal_list = [];
        if(signal.channels > 1){
          for(var j = 0;j<signal.channels;j++){
            var signalName = `${signal.name.substr(0, signal.name.indexOf("["))}[${j}]`,
                ballInfo = lookupSignal(signalName, signalBallMap);
            signal.signal_list.push(ballInfo);
          }
        }
        else {
          var ballInfo = lookupSignal(signal.name, signalBallMap);
          signal.signal_list.push(ballInfo);
        }
        //update result
        result[i] = signal;
      }
      send_json(res, result);
    });
  });
});


app.get('/api/device/footprints', function (req, res) {
  var device_id = req.query.id;
  getDeviceFootprints(device_id, function (err, result, fields) {
    res.setHeader("content-type", "application/json");
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.end(JSON.stringify(result, null, 2));
  });
});

app.get('/api/device/ball_signal_map', function (req, res) {
  var device_id = req.query.id;
  getDeviceBallSignalMap(device_id, function (err, result, fields) {
    res.setHeader("content-type", "application/json");
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.end(JSON.stringify(result, null, 2));
  });
});


app.get('/api/device/list', function (req, res) {
  var device_id = req.query.id;
  getDevices(function (err, result, fields) {
    res.setHeader("content-type", "application/json");
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.end(JSON.stringify({ data: result, query: req.query }, null, 2));
  });
});

app.get('/api/device/add', function (req, res) {
  var device_name = req.query.name;
  addDevices(device_name, function (err, result, fields) {
    //console.log(arguments)
    res.setHeader("content-type", "application/json");
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.end(JSON.stringify(result, null, 2));
  });
});

app.get('/api/device/interface/add', function (req, res) {
  var device_id = req.query.id,
      interface_name = req.query.name;
  addInterface(device_id, interface_name, function (err, result, fields) {
    res.setHeader("content-type", "application/json");
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.end(JSON.stringify(result, null, 2));
  });
});

app.get('/api/device/interface/list', function (req, res) {
  var device_id = req.query.id;
  getInterfaceNames(device_id, function (err, result, fields) {
    res.setHeader("content-type", "application/json");
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.end(JSON.stringify({ data: result } , null, 2));
  });
});

app.post('/api/device/interface/signals', function (req, res) {
  var signal_id = Object.keys(req.body.data)[0];
  var signal =  req.body.data[signal_id] || req.body.data[0];
  
  if(!('signal_id' in signal)) signal.signal_id = signal_id;
  
  switch(req.body.action){
    case 'create':
      addInterfaceSignal(signal.interface_id, signal, function (err, result, fields) {
        res.setHeader("content-type", "application/json");
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.end(JSON.stringify([err, result, fields], null, 2));
      });
      break;
    case 'edit':
      updateSignal(signal,function (err, result, fields) {
        res.setHeader("content-type", "application/json");
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.end(JSON.stringify([err, result, fields], null, 2));
      });
      break;
    case 'remove':
      removeInterfaceSignal(signal.interface_id, signal.signal_id, function (err, result, fields) {
        res.setHeader("content-type", "application/json");
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.end(JSON.stringify([err, result, fields], null, 2));
      });
      break;
    default:
      res.setHeader("content-type", "application/json");
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.end(JSON.stringify("Please choose to create/edit/remove a signal.", null, 2));
  }
});

app.get('/api/device/interface/signals', function (req, res) {
  var interface_id = req.query.id;
  
  getInterfaceSignals(interface_id, function (err, result, fields) {
    res.setHeader("content-type", "application/json");
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.end(JSON.stringify({ data: result, query: req.query }, null, 2));
  });
});

app.get('/api/device/interface/signals/copy', function (req, res) {
  var src_interface_id = req.query.id,
      dest_interface_id = req.query.dest_id;
  copyInterfaceSignals(src_interface_id, dest_interface_id, function (err, result, fields) {
    res.setHeader("content-type", "application/json");
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.end(JSON.stringify(result, null, 2));
  });
});

app.get('/api/device/interface/signal/add', function (req, res) {
  var interface_id = req.query.id,
      signalObject = JSON.parse(req.query.signal);
  addInterfaceSignal(interface_id, signalObject, function (err, result, fields) {
    res.setHeader("content-type", "application/json");
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.end(JSON.stringify(arguments, null, 2));
  });
});

app.get('/api/device/interface/signal/remove', function (req, res) {
  var interface_id = req.query.id,
      signal_id = req.query.signal_id;
  removeInterfaceSignal(interface_id, signal_id, function (err, result, fields) {
    res.setHeader("content-type", "application/json");
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.end(JSON.stringify(arguments, null, 2));
  });
});

app.listen(3000)
