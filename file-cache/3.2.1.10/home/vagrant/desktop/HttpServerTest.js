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
using('api.v1.payment');
using('api.v1.ansible_task_manager');
using('api.v1.ansible_playbook_manager');
class test extends Microservice {
  static get path() {
    return ["/test"]
  }

  GET() {
    console.log("GET", this.req.query);
    this.res.json(this.req.query);
  }

  POST() {
    console.log("POST", this.req.post);
    this.res.json(this.req.post);
  }
}

var webAPI = new WebApi([ssh2, test, inventory, Upload, payment, ansible_task_manager, ansible_playbook_manager]);
//webAPI.authenticate = false;
//webAPI.setSessionManager(MongoDBSession);
webAPI.start(8090);




var domainManager = new DomainManager();
domainManager.add('api.localhost', 'http://localhost:8090');
domainManager.add('localhost', 'http://localhost:8091');
domainManager.start(80);








