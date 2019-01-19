using('System.Network.Authenticate');
using('System.Network.HTTP.SessionManager');
using('System.Network.HTTP.HTTPStatusCode');
using('System.Network.HTTP.ServerResponse');
using('System.Network.HTTP.IncomingMessage');
using('System.Network.HTTP.ContentType');

class PublicServer {

  constructor(){
    this.authenticate = false;
    this.protocol = 'http';
    this.sessionManager = SessionManager;
    this.maxPayloadSize = 100e6;
    this.ctor.apply(this, arguments);
  }

  ctor(){
    this.createServer(System.getModule(this.protocol));
  }

  createServer(serverModule, settings) {
    if(!serverModule) throw new Error("Http server module not assigned.");
    let serverHandle = (req, res) => {
      req.startTime = req.headers['x-forwarded-timestamp'] ? Number(req.headers['x-forwarded-timestamp']) : Date.now();
      req.httpRequestRecievedTime = Date.now();
      this.onHttpRequestReceived(req, res);
    };
    this.server = settings ? serverModule.createServer(settings, serverHandle) : serverModule.createServer(serverHandle);
    this.server.timeout = 30000;
    this.server.on('close', ()=>this.onServerClose());
  }

  start(port) {
    //assign default port values if not provided
    port = port || 80;
    //listen to port
    this.server.listen(port, () => {
      console.log(`${this.constructor.name} server listening on port ${port}.`);
      //console.log(`Session managed by ${this.sessionManager.name}.`);
      this.onServerStarted(port);
    });
  }

  setSessionManager(sessionManager){
    this.sessionManager = sessionManager;
  }

  info() {
    console.log.apply(console, arguments);
  }

  processPost2(req, res){
    var multiparty = System.getModule('multiparty');
    var form = new multiparty.Form();
    form.parse(req, (err, fields, files) => {
      if(err) console.log(err);
      else {
        req.post = {
          fields: fields,
          files: files
        };
      }
      this.onProcessPostComplete(req, res);
    });
  }

  processMultipartFormData(req, res){


  }

  processPost(req, res) {
    let contentType = req.headers['content-type'];
    let contentTypeParams = PublicServer.parseParams(contentType);
    let payload = new Buffer(0);
    req.post = {};
    if(req.method == 'POST') {
      //console.log('POST', 'content-type=', contentType);
      req.on('data', (data) => {
        //
        // append buffe data
        //
        payload = Buffer.concat([payload, data]);
        //
        // check payload for max length
        //
        if(payload.length > this.maxPayloadSize) {
          payload = null;
          res.status(HTTPStatusCode.PayloadTooLarge);
          //res.setHeader('Content-Type', 'text/plain');
          var msg = `Max Payload Size Exceeded: ${this.maxPayloadSize}`;
          console.log(msg);
          res.end(msg);
          req.connection.destroy();
        }
      });
      req.on('end', () => {
        req.payload = payload;
        if(contentType.indexOf('multipart/form-data') != -1){
          //console.log(this.constructor.name, 'Payload Size: ' + req.payload.length, req.headers.origin);
          //var regexp = new RegExp(contentTypeParams.boundary, 'g');
          //var match = null;
          //while(match = regexp.exec(payload)){
          //  console.log(match.index);
          //}
          this.onProcessPostComplete(req, res);
        } 
        else if(contentType.indexOf('application/x-www-form-urlencoded') !=-1){
          const querystring = System.getModule('querystring');
          req.post = querystring.parse(payload.toString());
          this.onProcessPostComplete(req, res);
        }
        else { //text/plain
          req.post = payload.toString();
          this.onProcessPostComplete(req, res);
        }
      });
    }
    else {
      this.onProcessPostComplete(req, res);
    }
  }
  static removeDblQuotes(str){
    if(str == undefined || str.indexOf('"') == -1) return str;
    let start = str.indexOf('"') + 1;
    return str.substr(start, str.lastIndexOf('"') - start)
  } 
  static parseParams(lineItem){
    var params = {};
    if(lineItem == undefined) return params;
    if(lineItem.indexOf(';') == -1) return lineItem;
    lineItem.split(';').forEach(item => {
      let pair = item.trim().split('=');
      params[pair[0]] = decodeURIComponent(decodeURI(this.removeDblQuotes(pair[1])));
    });
    return params;
  }

  handleHttpRequest(req, res){
    this.onHttpRequestAcknowledged(req, res);
    this.onHttpRequestComplete(req, res);
  }


  processSession(req, res){
    if(this.sessionManager){
      this.sessionManager.run(req, res, ()=>this.onProcessSessionComplete(req, res));
    }
    else {
      this.onProcessSessionComplete(req, res);
    }
  }

  parseRequestURL(req, res){
    req.query = {};
    let url = System.getModule('url').parse(req.url, true);
    if(url) {
      req.URL = url;
      //req.url = url;
      req.query = url.query;
    }
    this.onParseRequestURLComplete(req, res);
  }

  onHttpRequestReceived(req, res){
    //console.log(this.constructor.name, req.headers.host, 'onHttpRequestReceived', req.url);
    this.processSession(req, res);
  }

  onHttpRequestAcknowledged(req, res){
    req.acknowlegeTime = Date.now();
    req.timeToAcknowlege = req.acknowlegeTime - req.httpRequestRecievedTime;
    console.log('took', req.timeToAcknowlege + "ms");
  }

  registerHttpRequestStats(req, res){
    req.completeTime = Date.now();
    req.latency = req.completeTime - req.startTime;
  }

  defaultHttpResponse(req, res){
    let transactionInfo = [(new Date()).toString(), 
                           this.protocol + "://" + req.headers.host + req.url, 
                           'Latency: ' + req.latency + 'ms', 
                           'IP: ' + req.ip()].join('<br/>');
    res.setHeader('content-type', 'text/html');
    res.end(transactionInfo);
  }

  onHttpRequestComplete(req, res){
    this.registerHttpRequestStats(req, res);
    this.defaultHttpResponse(req, res);
  }


  onServerStarted(port){
    this.startTime = Date.now();
    let date = new Date(this.startTime);
    this.info(this.constructor.name + ' started', date.toDateString(), date.toTimeString());
  }

  onServerClose(){
    this.info('Server closed', date.toDateString(), date.toTimeString());
  }

  onProcessSessionComplete(req, res){
    this.parseRequestURL(req, res);
  }

  onProcessPostComplete(req, res) {
    //console.log(this.constructor.name, req.headers.host, 'onProcessPostComplete', req.url);
    if(this.authenticate){
      Authenticate.check(req, res, () => {
        this.handleHttpRequest(req, res);
      });
    } 
    else {
      this.handleHttpRequest(req, res);
    }
  }

  onParseRequestURLComplete(req, res){
    this.processPost(req, res);
  }
}




































































