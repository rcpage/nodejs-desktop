global.System = require('./System.js');
using('System.Network.DomainManager');

var domainManager = new DomainManager();
domainManager.add('api.localhost', 'http://localhost:8090');
domainManager.add('localhost', 'http://localhost:8091');
domainManager.start(8080);