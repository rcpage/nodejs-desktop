global.System = require('./System.js');
global.mongo = require('./models/mongo');
global.rootDirectory = __dirname;
using('System.Network.DomainManager');
using('System.Network.PublicFileService');
using('System.Network.Authenticate');
using('System.Network.HTTP.Session.MongoDBSession');
using('System.Network.WebApi');



var fileServer = new PublicFileService(__dirname + '/www/');
//fileServer.authenticate = false;
//fileServer.setSessionManager(MongoDBSession);
fileServer.start(8091);

//using('api.v1.ssh');
using('api.v1.ssh2');
using('api.v1.inventory');
using('api.v1.upload');
class test extends Endpoint {
	static get path(){
		return ["/test"]
    }
}

var webAPI = new WebApi([ssh2, test, inventory, Upload]);
//webAPI.authenticate = false;
//webAPI.setSessionManager(MongoDBSession);
webAPI.start(8090);




var domainManager = new DomainManager();
domainManager.add('api.fedora29','http://localhost:8090');
domainManager.add('fedora29','http://localhost:8091');
domainManager.start(80);








