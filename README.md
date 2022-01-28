# Desktop Application Server


The application implements a desktop-like environment for remote hosts.  Credentials are used to connect via SSH using microservice REST API to implement a file explorer over the web (similar to native desktop applications running on a PC or laptop). A text editor allows users to edit files remotely.

### Run Example


```
git clone https://github.com/rcpage/nodejs-desktop.git
cd nodejs-desktop
node HttpServerTest.js 
System.Server
System.Network.HTTP.HTTPStatusCode
System.Network.Authenticate
System.Network.HTTP.SessionManager
System.Network.HTTP.ServerResponse
System.Network.HTTP.IncomingMessage
System.Network.HTTP.ContentType
System.Network.PublicServer
System.Network.DomainManager
System.Network.PublicFileService
System.Network.HTTP.Session.MongoDBSession
System.Network.HTTP.Handle
System.Network.HTTP.Microservice
System.Network.WebApi
api.v1.ssh2
api.v1.inventory
System.Text
api.v1.upload
api.v1.payment
HTTP Handle ssh2 localhost:8090/v1/ssh2
HTTP Handle ssh2 localhost:8090/v1/ssh2/{action}
HTTP Handle test /test
HTTP Handle inventory localhost:8090/v1/inventory
HTTP Handle inventory localhost:8090/v1/inventory/{action}
HTTP Handle Upload /upload
HTTP Handle payment localhost:8090/v1/payment
HTTP Handle payment localhost:8090/v1/payment/{context}
HTTP Handle payment localhost:8090/v1/payment/{context}/{action}
PublicFileService server listening on port 8091.
PublicFileService started Fri Jan 28 2022 12:33:22 GMT-0600 (Central Standard Time)
WebApi server listening on port 8090.
WebApi started Fri Jan 28 2022 12:33:22 GMT-0600 (Central Standard Time)
```

### Browser Preview (AngularJS Application)

```
http://localhost:8091/apps/desktop/index.html
```

![Alt text](/www/images/desktop-app.png?raw=true "Title")

# Microservice Example

```
global.System = require('./System.js');
using('System.Network.WebApi');
using('System.Network.HTTP.Microservice');

class Example extends Microservice {
    static get path() {
        return ["/microservice"]
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

var webAPI = new WebApi([Example]);
webAPI.start(8090);
```

# Browser Preview (application/json)
```
node microservice.js 
System.Server
System.Network.HTTP.HTTPStatusCode
System.Network.Authenticate
System.Network.HTTP.SessionManager
System.Network.HTTP.ServerResponse
System.Network.HTTP.IncomingMessage
System.Network.HTTP.ContentType
System.Network.PublicServer
System.Network.HTTP.Handle
System.Network.HTTP.Microservice
System.Network.WebApi
System.Network.HTTP.Session.MongoDBSession
HTTP Handle Example /microservice
WebApi server listening on port 8090.
WebApi started Fri Jan 28 2022 11:53:47 GMT-0600 (Central Standard Time)
```
```
http://localhost:8090/microservice?hello=world!
```

```
{"hello":"world!"}
```

# File Server Example

```
global.System = require('./System.js');
using('System.Network.PublicFileService');

var fileServer = new PublicFileService(__dirname + '/www/');
fileServer.start(8091);
```

```
http://localhost:8091/apps/desktop/index.html
```

# HTTP Domain Router

```
global.System = require('./System.js');
using('System.Network.DomainManager');

var domainManager = new DomainManager();
domainManager.add('api.localhost', 'http://localhost:8090');
domainManager.add('localhost', 'http://localhost:8091');
domainManager.start(8080);
```



Build binaries from package.json

```sh
pkg .
```

Command create following binaries.

- desktop-linux - Linux
- desktop-macos - MacOS 
- desktop-win.exe - Windows