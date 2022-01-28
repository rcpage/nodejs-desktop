global.System = require('./System.js');
const jsyaml = require('js-yaml');
global.rootDirectory = __dirname;
using('System.Network.DomainManager');
using('System.Network.PublicFileService');
using('System.Network.Authenticate');
using('System.Network.HTTP.Session.MongoDBSession');
using('System.Network.WebApi');
using('System.Database.Storage');
const NodeSession = require('node-session');
// init
console.log(__dirname);
var session = new NodeSession({
  secret: 'Q3UBzdH9GEfiRCTKbi5MTPyChpzXLsTD',
  cookie: 'sessionID',
  files: __dirname + '/.storage/session'
});



var fileServer = new PublicFileService(__dirname + '/www/');
//fileServer.authenticate = false;
//fileServer.setSessionManager(MongoDBSession);
fileServer.start(1010);

class test extends Microservice {
  static get path() {
    return ["/test"]
  }

  GET() {
    if (!this.req.query.q) {
      this.res.setHeader('content-type', 'text/html');
      this.res.end('<form action="//localhost:1011/test?q=add.accounts.user" method="POST"><input name="email"/><input name="password" type="password"/><input type="submit"/></form>');
    } else {
      this.executeAction();
    }
  }

  POST() {
    this.executeAction();
  }

  executeAction() {
    // start session for an http request - response
    // this will define a session property to the request object
    session.startSession(this.req, this.res, () => {
      this.req.session.start(() => {
        //test session
        console.log(this.req.session.get('username'));
        //init vars
        var args = this.getRequestParameter('q').split('.'),
          doc = this.getRequestParameter('doc'),
          filter = this.getRequestParameter('filter'),
          update = this.getRequestParameter('update'),
          payload = JSON.stringify(this.req.post),
          database = args[1],
          collection = args[2],
          action = args[0],
          pretty = args[3],
          queryHandle = nullArg => {
            Storage.query('db', database, collection, action, (doc || filter || payload), update, (err, result) => {
              var val = [err, result];
              if (pretty == "pretty") {
                val = JSON.stringify(val, null, 2);
                this.res.end(val);
              }
              else {
                this.res.json(val);
              }
            });
          }
        //encrypt passwords
        if (this.req.post.password) {
          System.createPassword(this.req.post.password, secureString => {
            this.req.post.password = secureString;
            payload = JSON.stringify(this.req.post);
            queryHandle();
          });
        }
        else {
          queryHandle();
        }

      });
    });
  }
}

var webAPI = new WebApi([test]);
//webAPI.authenticate = false;
//webAPI.setSessionManager(MongoDBSession);
webAPI.start(1011);

//var domainManager = new DomainManager();
//domainManager.add('api.localhost','http://localhost:8090');
//domainManager.add('localhost','http://localhost:8091');
//domainManager.start(80);








