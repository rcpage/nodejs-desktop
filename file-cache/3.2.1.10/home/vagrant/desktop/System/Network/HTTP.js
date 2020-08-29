using('System.V8');
using('System.Server');
using('System.Network.HTTP.HTTPStatusCode');
using('System.Network.HTTP.ServerResponse');
using('System.Network.HTTP.IncomingMessage');
using('System.Network.HTTP.HTTPSession');
using('System.Network.HTTP.ContentType');
class HTTP {

  isPublicResource(req){
    return req.isPublic === true; 
  }

  isSessionAuthorized(req) {
    let isAuth = (req.session && req.session.authorized == true) || false;
    return isAuth;
  }

  isSignOnRequsted(req, res){
    let returnValue = req.query.signon && req.query.signon.toString() == "true";
    return  returnValue;
  }

  constructor(){
    this.ctor.apply(this, arguments);
  }

  ctor(https){
    this.runtime = {
      requests: []
    };
//    this.mongo = System.getModule('/stack/models/mongo');
    this.useBasicAuth = true;
    this.debug = false;
    this.maxPayloadSize = 1e6;
    let http = this;

    let serverHandle = (req, res) => {
      req.startTime = req.headers['x-forwarded-timestamp'] ? 
        Number(req.headers['x-forwarded-timestamp']) : Date.now();
      req.httpRequestRecievedTime = Date.now();
      this.onHttpRequestReceived(req, res);
    };

    if(https) {

      this.server = V8.HTTPS.createServer(https, serverHandle);
      this.isServerSecure = true;
      this.protocol = 'https';
    }
    else {
      this.server = V8.HTTP.createServer(serverHandle);
      this.protocol = 'http';
    }
    this.server.timeout = 30000;
    this.server.on('close', ()=>{ http.onServerClose(); });
    let WebSocketServer = System.getModule('websocket').server;
    this.webSocketProtocol = 'echo-protocol';
    this.websocket = new WebSocketServer({
      httpServer: this.server,
      // You should not use autoAcceptConnections for production 
      // applications, as it defeats all standard cross-origin protection 
      // facilities built into the protocol and the browser.  You should 
      // *always* verify the connection's origin and decide whether or not 
      // to accept it. 
      autoAcceptConnections: false
    });
    this.websocket.on('request', function(request) {
      try {
        if (!http.isWebSocketOriginAllowed(request.origin)) {
          // Make sure we only accept requests from an allowed origin 
          request.reject();
          http.onWebSocketRequestRejected(request);
          return;
        }
        var connection = request.accept(http.webSocketProtocol, request.origin);
        http.onWebSocketConnectionAccepted(connection);
        connection.on('message', function(message) {
          http.onWebSocketMessageReceived(connection, message);
        });
        connection.on('close', function(reasonCode, description) {
          http.onWebSocketConnectionClose(reasonCode, description);
        });
      }
      catch(err){
        http.onWebSocketConnectionError(err);
      }
    });
  }

  onWebSocketConnectionError(err){
    console.error(err);
  }

  onWebSocketConnectionClose(reasonCode, description){
    console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
  }

  onWebSocketConnectionAccepted(connection){
    console.log((new Date()) + ' Connection accepted.');
  }

  onWebSocketRequestRejected(request){
    console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');    
  }

  onWebSocketMessageReceived(connection, message){
    if (message.type === 'utf8') {
      console.log('Received Message: ' + message.utf8Data);
      connection.sendUTF(message.utf8Data);
    }
    else if (message.type === 'binary') {
      console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
      connection.sendBytes(message.binaryData);
    }
  }

  isWebSocketOriginAllowed(origin) {
    // put logic here to detect whether the specified origin is allowed. 
    return true;
  }

  status(status, msg) {
    let args = [this.req.ip(), status, this.protocol+ '://', this.req.headers.host + ':' + this.server.address().port + this.req.url, msg];
    //for(var i in arguments) args.push(arguments[i]);
    console.log.apply(console, args);
  }

  info() {
    console.log.apply(console, arguments);
  }

  log() {
    //if(arguments[0] != "/") return;
    if(this.debug) {
      console.log.apply(console, arguments);
    }
  }

  processPost(req, res) {
    let http = this;
    let payload = new Buffer(0);
    req.post = {};
    if(req.method == 'POST') {
      req.on('data', function(data) {
        payload = Buffer.concat([payload, data]);
        if(payload.length > this.maxPayloadSize) {
          payload = null;
          res.writeHead(HttpStatusCode.PayloadTooLarge, {'Content-Type': 'text/plain'}).end();
          req.connection.destroy();
        }
      });
      req.on('end', function() {
        const querystring = System.getModule('querystring');
        req.post = querystring.parse(payload.toString());
        req.payload = payload;
        http.onProcessPostComplete(req, res);
      });
    }
    else {
      http.onProcessPostComplete(req, res);
    }
  }

  handleHttpRequest(req, res){
    this.onHttpRequestHandled(req, res);
  }

  checkAuthorization(req, res){
    if(this.authorizationRequestedByUser(req, res)){
      req.userAuth = true;
      this.authenticate(req, res);
    }
    else if(this.checkRequestQueryForLogOff(req, res)){
      this.info('USER LOGOFF REQUESTED...');
      req.userLogOff = true;
      this.onLogoff(req, res);
    }
    else {
      if(this.isSessionAuthorized(req)){
        this.onCheckAuthorizationComplete(req, res);
      } else {
        console.log((new Date()).toString(), '-', req.ip() + ' UNAUTHORIZED http://' + req.headers.host + ':' + this.server.address().port + req.url);
        req.deniedAccess = true;
        this.onAuthorizationRequired(req, res);
      }
    }
  }

  checkRequestQueryForLogOff(req, res){
    if(req.query.logoff && req.query.logoff.toString() == "true"){
      return true;
    }
    return false;
  }

  authorizationRequestedByUser(req, res){
    let credentials = this.getUserCredentials(req);
    let authorizedSession = this.isSessionAuthorized(req);
    let isPostRequest = req.method == "POST" ? true : false;
    //this.info(req.headers.host + req.url.path);
    //this.info("server user credentials     = " + credentials);
    //this.info("server session authorized   = " + authorizedSession);
    if(credentials && !authorizedSession && isPostRequest && req.post.cmd.startsWith("login")){
      return true;
    }

    return false;
  }

  authenticate(req, res){
    let http = this;
    let credentials = this.getUserCredentials(req, res);
    let pair = credentials.split(':');
    if(pair.length == 2) {
      let user = pair[0];
      let password = pair[1];
      req.user = user;
      //req.connection.remoteAddress, 
      //req.socket.remoteAddress,
      //https only: req.connection.socket.remoteAddress
      this.info('authenticating...' + user);
      function onSuccessHandle()  { http.onAuthSuccess(req, res); }
      function onErrorHandle(err) { http.onAuthError(req, res, err); }
      if(user.length > 0 && password.length > 0) {
        if(System.isWindows){
          Server.authenticateWindows(user, password, onSuccessHandle, onErrorHandle);  
        }
        else {
          Server.authenticate(user, password, onSuccessHandle, onErrorHandle);
        }
      }
      else this.onAuthError(req, res, "Username and password is required.");
    } 
    else {
      this.onAuthError(req, res, "Username and password pair is required.");
    }
  }

  deleteSessionAuth(req, res){
    delete req.session.authorized;
    delete req.session.user;
  }

  processSession(req, res){
    let http = this;
    HTTPSession.exe(req, res, function(){
      http.onProcessSessionComplete(req, res);
    }, this.isServerSecuire);
  }

  getUserCredentials(req, res){
    let credentials = null;
    if(req.headers.authorization){
      try {
        let basicAuth = req.headers.authorization;
        let base64EncodedText = basicAuth.replace('Basic ','');
        credentials = Buffer.from(base64EncodedText, 'base64').toString();
        return credentials
      } 
      catch(err){
        console.error(err);
      }
    }
    else {
      function getParams(){
        let params = {},
            list =  req.post.cmd ? req.post.cmd.split(' ') : [],
            cmd = list[0],
            args = [];
        for(let i = 1;i < list.length; i++) {
          if(list[i]) args.push(list[i]); 
        }
        params.cmd = cmd;
        params.args = args;
        return params;
      }

      function getUser(){
        let user = getParams().args[0];
        return user;
      }

      function getPassword(){
        let password = "";
        var params = getParams();
        if(params.args[1]){
          let codeList = params.args[1].split(';');
          for(let i in codeList) {
            let c = Buffer.from(codeList[i] + '==', 'base64');
            password += c;
          }
        }
        return password;
      }

      if(req.post.cmd && getParams().cmd == "login" && getParams().args.length > 0){
        credentials = getUser() + ':' + getPassword();
      }

    }
    return credentials;
  }

  parseRequestURL(req, res){
    req.query = {};
    let url = V8.URL.parse(req.url, true);
    if(url) {
      req.URL = url;
      //req.url = url;
      req.query = url.query;
    }
    this.onParseRequestURLComplete(req, res);
  }

  start(port) {
    var self = this;
    //assign default port values if not provided
    if(this.isServerSecure) port = port || 443;
    else port = port || 80;
    //listen to port
    this.server.listen(port, function(){
      let protocol = self.isServerSecure ? 'HTTPS':'HTTP';
      console.log(`${protocol} server listening on port ${port}.\nFile service path: ${self.www}`);
      self.onServerStarted(port);
    });
  }

  static getHitLog(req){
    let hit = {
      'user-agent':req.headers['user-agent'],
      user : req.session.user,
      transaction : {
        origin: req.startTime,
        latency: req.latency,
        acknowledge:req.timeToAcknowlege
      },
      timestamp: Date.now(),
      https: req.isHTTPS(),
      host: req.headers.host,
      port: req.socket.localPort,
      path: req.url,
      ip: req.ip(),
      sessionID: req.sessionID,
      file: req.isFile || false,
      service:req.isService || false
    };
    if(req.headers['x-forwarded-timestamp']){
      hit.forwarded = {
        'x-forwarded-timestamp': req.headers['x-forwarded-timestamp'],
        'x-forwarded-host' : req.headers['x-forwarded-host'],
        'x-forwarded-proto': req.headers['x-forwarded-proto'],
        'x-forwarded-port' : req.headers['x-forwarded-port'],
        'x-forwarded-for'  : req.headers['x-forwarded-for']
      };
    }
    return hit;
  }

  logHttpRequest(req, res){
    if(!req) return;
    let hit = HTTP.getHitLog(req);
    //this.info(hit);
    this.mongo.db.collections.insert("requests", hit);
  }

  onHttpRequestReceived(req, res){
    this.processSession(req, res);
  }

  onHttpRequestHandled(req, res){
    req.acknowlegeTime = Date.now();
    req.timeToAcknowlege = req.acknowlegeTime - req.httpRequestRecievedTime;
  }

  onHttpRequestComplete(req, res){
    req.completeTime = Date.now();
    req.latency = req.completeTime - req.startTime;
    this.info((new Date()).toString(), '-', req.session.user + "@" + req.ip() + " DONE " + this.protocol + "://" + req.headers.host + ':' + this.server.address().port + req.url, 'took ' + req.latency + 'ms');
    this.logHttpRequest(req, res);
  }


  onServerStarted(port){
    this.startTime = Date.now();
    let date = new Date(this.startTime);
    this.info('Server started', date.toDateString(), date.toTimeString());
  }

  onServerClose(){
    this.info('Server closed', date.toDateString(), date.toTimeString());
  }

  onCheckAuthorizationComplete(req, res){
    this.handleHttpRequest(req, res);
  }

  onAuthSuccess(req, res){
    this.info('onAuthSuccess');
    req.session.authorized = true;
    req.session.user = req.user;
    this.onCheckAuthorizationComplete(req, res);
  }

  onAuthError(req, res, err){
    req.authError = err;
    this.info('onAuthError', err);
    this.deleteSessionAuth(req, res);
    this.onAuthorizationRequired(req, res);
  }

  onLogoff(req, res){
    this.info('onLogoff');
    this.deleteSessionAuth(req, res);
    this.onAuthorizationRequired(req, res);
  }

  onAuthorizationRequired(req, res){
    res.statusCode = HTTPStatusCode.NotAuthorized;
    if(this.isSignOnRequsted(req, res)) {
      if(this.useBasicAuth){
        res.setHeader('WWW-Authenticate', 'Basic realm="This site requires authorization."');
      }
    }
    res.setHeader('Content-type', "text/html");
    res.end(System.readFile(global.stack + '/HTML/Templates/NotAuthorized.html'));
  }

  onProcessSessionComplete(req, res){
    this.parseRequestURL(req, res);
  }

  onProcessPostComplete(req, res){
    this.checkAuthorization(req, res);
  }

  onParseRequestURLComplete(req, res){
    this.processPost(req, res);
  }

  static sendFile(fullpath, req, res, contentType){
    var sent = false;
    // parse URL
    const parsedUrl = V8.URL.parse(req.url);
    // extract URL path
    let pathname = `${parsedUrl.pathname}`;
    // based on the URL path, extract the file extention. e.g. .js, .doc, ...
    const ext = V8.Path.parse(pathname).ext;
    //get extension content type from argument, class, or default;
    var contentType = contentType || ContentType.get(ext) || 'text/plain';
    //read fullpath from system disk
    var data = System.readFile(fullpath);
    //send file if not empty
    if(data != null){
      // if the file is found, set Content-type and send data
      res.setHeader('Content-Type', contentType);
      res.end(data);
      sent = true;
    }
    return sent;
  }

  static streamFile(fullpath, req, res, contentType, onComplete) {
    let sent = false;
    try {
      let file = System.getModule('fs').createReadStream(fullpath);
      file.on('close', function close(){ if(onComplete) onComplete(); });
      if(file) {
        HTTP.pipeFileHandle(fullpath, file, req, res);
        sent = true;
      }
    } 
    catch(err){
      console.error('ERROR: HTTP.streamFile', err);
    }
    return sent;
  }

  static pipeFileHandle(fullpath, file, req, res){
    if(file) {
      const ext = V8.Path.parse(fullpath).ext;
      var contentType = contentType || ContentType.get(ext) || 'text/plain';
      var stats = System.getModule('fs').statSync(fullpath);
      var moment = System.getModule('moment');
      if(contentType.startsWith('image')){
        res.setHeader('Cache-Control', 'max-age=86400');
      }
      else {
        res.setHeader('Cache-Control', 'no-store');
      }
      res.setHeader('Last-Modified', moment(stats.mtime).utc().format('ddd, DD MM YYYY HH:mm:ss ') + "GMT");
      res.setHeader('Content-Type', contentType);
      file.pipe(res);
    }
  }

}


























































