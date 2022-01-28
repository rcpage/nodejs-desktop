global.System = require('./System.js');
using('System.Network.PublicFileService');

var fileServer = new PublicFileService(__dirname + '/www/');
fileServer.start(8091);