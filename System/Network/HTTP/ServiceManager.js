using('System.Network.HTTP.HTTPStatusCode');
using('System.Network.HTTP.FileService');
using('System.Network.HTTP.WebPage');
using('HTML.Page');

class ServiceManager extends FileService {

  ctor(www, httpHandles, secure) {
    this.handles = [];
    super.ctor(www, secure);
    this.loadHTTPHandles(httpHandles);

  }

  loadHTTPHandles(httpHandles) {
    for (let i in httpHandles) {
      let handlePath = httpHandles[i].path;
      let paths = handlePath;
      if (typeof handlePath == "string") {
        paths = handlePath.split('|');
      }
      for (var j in paths) {
        let path = paths[j].trim();
        if (this[path] == undefined) {
          this[path] = httpHandles[i];
          this.handles.push(path);
          console.log('HTTP Handle', httpHandles[i].name + " " + path);
        }
        else {
          throw new Error('Duplicate path handle detected. ' + path + ", Handle: " + httpHandles[i].name);
        }
      }
    }
  }

  handleHttpRequest(req, res) {
    let HTTPHandleObject = this.getHTTPHandle(req);
    //console.log('ServiceManager.handleHttpRequest');
    if (this.canSendFile(req)) {
      //call FileService.serviceFileRequest method
      super.handleHttpRequest(req, res);
    }
    else if (HTTPHandleObject) {
      //call ServiceManager.serviceHTTPHandle
      req.handle = HTTPHandleObject;
      this.serviceHTTPHandle(req, res);
    }
    else {
      this.onServiceNotFound(req, res);
    }
  }

  serviceHTTPHandle(req, res) {
    //console.log('ServiceManager.serviceHTTPHandle', req.URL.pathname);
    try {
      let pathHandle = req.URL.pathname;
      let HTTPHandleObject = req.handle;
      let onCompleteEventHandle = () => {
        this.onServiceComplete(req, res);
      };
      if (HTTPHandleObject.prototype instanceof Handle) {
        //dispatch service handle
        this.onHttpRequestHandled(req, res);
        let handle = new HTTPHandleObject(req, res, undefined, onCompleteEventHandle);
        //TODO: do i need to dispose handle after period of time....?
      }
      else if (HTTPHandleObject.prototype instanceof Microservice) {
        this.onHttpRequestHandled(req, res);
        HTTPHandleObject.run(req, res);
        this.onServiceComplete(req, res);
      }
      else {
        this.onServiceNotFound(req, res);
      }
    }
    catch (err) {
      this.onHttpServiceError(req, res, err);
    }
  }

  onHttpServiceError(req, res, err) {
    if (err instanceof Error) {
      res.end(err.stack);
    } else {
      res.json(err);
    }
  }

  onServiceComplete(req, res) {

    this.onHttpRequestComplete(req, res);
  }

  onServiceNotFound(req, res) {
    res.status(HTTPStatusCode.NotFound).end("Service not found.");
  }

  requestPathMatchesHandlePath(handleKeys, requestKeys) {
    //
    //make sure request path matches handle path pattern
    //
    for (var key in handleKeys) {
      //ignore variables
      if (handleKeys[key].isVariable) continue;
      if (requestKeys[key] == undefined || handleKeys[key].word != requestKeys[key].word) {
        return false;
      }
    }
    return true;
  }

  getHTTPHandle(req) {
    let handle = null;

    for (var i in this.handles) {
      let handlePath = this.handles[i],
        handlePaths = handlePath.split('/'),
        handleParameters = this.getPathVars(handlePath),
        requestPath = req.URL.pathname,
        requestPaths = requestPath.split('/'),
        requestParameters = this.getPathVars(requestPath);

      //console.log(requestParameters, ' vs. ', handleParameters);

      if (handlePaths.length != requestPaths.length) continue;
      //
      //Verify correct request handle is selected
      //
      //if(requestPath.startsWith(handleParameters.basePath)){
      if (this.requestPathMatchesHandlePath(handleParameters.keys, requestParameters.keys)) {
        //
        //build request pathParam object
        //
        var pathParam = handleParameters.pathParam;
        var pathVars = {};
        for (var i in pathParam) {
          var name = pathParam[i].variable,
            index = pathParam[i].index;
          //strip '{' and '}' from name
          name = name.substr(1, name.length - 2);
          pathVars[name] = requestPaths[index];
        }
        //console.log('Path Vars:', pathVars);
        handle = this[handlePath];
        req.pathParam = pathVars;

        console.log(requestPath, "=>", handle.name, req.method, handlePath);

        return handle;
      }
    }

    return handle;
  }

  getPathVars(path) {
    var paths = path.split('/');
    var basePath = '';
    var pathVars = [];
    var varFound = false;
    var keys = [];
    for (var i in paths) {
      var word = paths[i];
      var isVariable = false;
      if (word.length == 0) continue;
      if (word.startsWith('{') == false && word.endsWith('}') == false) {
        if (varFound == false) {
          basePath += '/' + word;
        }
      } else {
        isVariable = true;
        pathVars.push({ index: Number(i), variable: word });
        varFound = true;
      }
      keys.push({ index: Number(i), word: word, isVariable: isVariable });
    }
    return {
      basePath: basePath,
      pathParam: pathVars,
      keys: keys
    };
  }

}


