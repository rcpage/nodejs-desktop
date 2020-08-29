global.System = require('./System.js');
global.instances = {};
global.currentWorkingDirectory = {};
//list of shell commands
global.shell  = {};
//list of running pids
global.pid = {};

global.SSHConnection = {};

global.stdout = {};
global.stderr = {};

global.stack = __dirname;

using('Service.SecureServer');
using('Service.API');
using('Service.Database');
using('Service.LDAP');
using('Service.User');
using('Service.SystemInfo');
using('Service.Editor');
using('Service.Download');
//depricated...
using('Service.Socket');
using('Service.FileSystem');
using('Service.Endpoint');
using('Service.Encrypt');
using('Service.Upload');
using('Service.Storage');
using('Service.SSH');
var www = global.stack + '/www',
    services = [
      API, 
      Socket,
      FileSystem, 
      Database,
      Download,
      SystemInfo,
      Editor,
      User,
      LDAP,
      Endpoint,
      Encrypt,
      Upload,
      Storage,
      SSH
    ];
var server = new SecureServer(www, services);
server.useBasicAuth = true;
server.debug = false;
//test.start(5050);
server.start(8083);






































