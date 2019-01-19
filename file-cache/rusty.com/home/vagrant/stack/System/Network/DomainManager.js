using('System.Network.PublicServer');
class DomainManager extends PublicServer {

  ctor(options) {
    let httpProxy = System.getModule('http-proxy');
    this.targets = [ /* { domain: "desktop.expert", host:'http://localhost:8087' } */ ];
    //
    // Create a proxy server with custom application logic
    //
    this.proxy = httpProxy.createProxyServer(options || { xfwd:false, ws: false });

    //
    // Listen for the `error` event on `proxy`.
    this.proxy.on('error', (err, req, res) => {
      let protocol = req.isHTTPS() ? "https://":"http://",
          domain = protocol + req.headers.host,
          localhost = (err.address + ":" + err.port).replace('127.0.0.1', 'localhost');
      this.info((new Date()).toString(), '-', req.ip() + " ERROR " + this.protocol + "://" + req.headers.host + req.url, "connection refused.");
      res.status(HTTPStatusCode.InternalServerError).end();
    });

    //
    //ISSUE: canot forward POST request with body
    //https://github.com/nodejitsu/node-http-proxy/issues/667
    //
    this.proxy.on('proxyReq', function (proxyReq, req, res, options) {
      //var proxyReqHeaders = {};
      //console.log('onProxyReq', req.url);
      //for(var header in req.headers){
      //  var proxyHeader = proxyReq.getHeader(header),
      //     reqHeader = req.headers[header];
      //  proxyReqHeaders[header] = proxyHeader;
      //  if(proxyHeader != reqHeader){
      //    console.log('HEADER MISSING', header);
      //  }
      //}
      //var contentType = req.headers['content-type'];
      //if(contentType.indexOf('multipart/form-data') != -1){

      //}
      //else {
      if(req.payload){
        var length = Buffer.byteLength(req.payload);
        proxyReq.setHeader('Content-Length', length);
        proxyReq.write(req.payload);
      }
      //var body = req.post;
      //if (body) {
      //Assuming content type of 'application/x-www-form-urlencoded'
      //  var bodyData = Object.keys(body)
      //  .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(body[key])}`)
      //  .join('&');

      //  proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      //  proxyReq.write(bodyData);
      //}
      //}

    });

    super.ctor();
  }

  handleHttpRequest(req, res){
    this.dispatch(req, res);
  }


  add(domain, host){
    this.targets.push({ domain: domain, host: host }); 
    console.log("DOMAIN " + this.protocol + "://" + domain);
  }

  printTargets(){
    for(let i=0; i < this.targets.length; i++){
      console.log(this.targets[i]);
    }
  }

  dispatch(req, res) {
    try {
      let headers = req.headers;
      let host = headers != undefined && headers != null ? headers.host : undefined;
      if(host){
        let lowerCaseHost = host.toLowerCase();
        let found = false;
        for(let i=0; i < this.targets.length; i++){
          //check if reponse host equals target list
          if(lowerCaseHost == this.targets[i].domain){
            this.proxy.web(req, res, { 
              target: this.targets[i].host,
              headers: { 
                'x-forwarded-timestamp': Date.now()
              } 
            });
            found = true;
            break;
          }
        }
        if(!found) {
          res.status(HTTPStatusCode.NotAuthorized).end("<h1>Not Authorized</h1>");
        }
      } else {
        res.status(HTTPStatusCode.InternalServerError).end();
      }
    }
    catch(err){
      res.status(HTTPStatusCode.InternalServerError).end();
    }
  }

}

