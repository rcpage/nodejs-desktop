global.System = require('./System.js');
global.instances = {};
global.currentWorkingDirectory = {};
//list of shell commands
global.shell  = {};
//list of running pids
global.pid = {};

global.stdout = {};
global.stderr = {};

global.stack = __dirname;

using('System.Web.REST.API.Service.File');

console.log(System.Types);

