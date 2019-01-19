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
global.mongo = System.getModule('/stack/models/mongo');

using('Service.SecureServer');
using('api.v1.user');
using('api.v1.pipe');
using('api.v1.user-ui');
using('api.v1.ssh');
using('api.v1.keys');
using('api.v1.inventory');
using('api.v1.NodeFileSystem');
using('System.Network.HTTP.Endpoint');

class Test extends Handle  {
  static get path(){
    return [
      "/user/{action}/pathname/{id}",
      "/user2/{name}/{value}"
    ];
  }

  onGet(){
    this.res.json({ "PARAMS" : this.req.pathParam });
  }

}

class MyEndpoint extends Endpoint{

  static get path(){
    return ['/myEndpoint', '/v1/myEndpoint']
  }

  //static GET(){
  //  this.res.end("HELLO WORLD! " + this.req.url);
  //}

}


var www = global.stack + '/www',
    services = [
      user,
      userui,
      Test,
      MyEndpoint,
      ssh,
      pipe,
      NodeFileSystem,
      keys,
      inventory
    ];

function getNamespace(obj, path, objectList){
  var objects = objectList || [];
  var parent = path || "" ;
  for(var name in obj){
    var isFunc = System.isFunction(obj[name]);
    if(false == isFunc) {
      parent += name + '/';
      getNamespace(obj[name], parent, objects);
    }
    else {
      var path = parent + name;
      var fn = obj[name];
      fn.path = path;
      objects.push(fn);
    }
  }
  return objects;
}

class PublicServer extends SecureServer{

  isSessionAuthorized(){
    return true;
  }

}

//console.log(getNamespace(System.Namespace));

//console.log('Types:', System.Types);
//console.log('Namespace:', System.Namespace);
var server = new PublicServer(www, services);
server.useBasicAuth = true;
server.debug = false;
server.start(8088);







