var fs = require('fs');
var path = require('path');
var walk = function(dir, ignore, done) {
  var results = [];
  console.log(dir);
	if(ignore.indexOf(dir) == -1){
    fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function(file) {
      file = path.resolve(dir, file);
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(	file, ignore, function(err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          results.push(file);
          if (!--pending) done(null, results);
        }
      });
    });
  });
	} else {
		console.log('skipped', dir);
	}
};

var args = process.argv.slice(2);
var blacklist = ['/lib', '/lib64', '/usr/src/vboxguest-5.1.38', '/usr/lib64/python3.6'];
walk(args[0], blacklist, function(err, results) {
  if (err) throw err;
  console.log(results.length+" files.");
});
