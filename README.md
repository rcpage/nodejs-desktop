# Desktop Application Server


Run Example

```
node HttpTestServer.js
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
using('System.Network.HTTP.Session.MongoDBSession');

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
```
```
http://localhost:8090/microservice?a=1&b=2&c=3
```

```
{"a":"1","b":"2","c":"3"}
```

# File Server

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