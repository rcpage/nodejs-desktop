using('System.Network.HTTP.ServiceManager.js');

class LoadBalancer extends ServiceManager {

  ctor(www, httpHandles, secure, options, blacklist){
    let httpProxy = System.getModule('http-proxy');
    this.blacklist = blacklist || [];
    this.targets = [ /* { domain: "desktop.expert", host:'http://localhost:8087' } */ ];
    this.printTargets();
    //
    // Create a proxy server with custom application logic
    //
    this.proxy = httpProxy.createProxyServer(options || { xfwd:true, ws: true });

    //
    // Listen for the `error` event on `proxy`.
    this.proxy.on('error', (err, req, res) => {
      let protocol = req.isHTTPS() ? "https://":"http://",
          domain = protocol + req.headers.host,
          localhost = (err.address + ":" + err.port).replace('127.0.0.1', 'localhost');
      this.info((new Date()).toString(), '-', req.ip() + " ERROR " + this.protocol + "://" + req.headers.host + ':' + this.server.address().port + req.url, "connection refused.");
      res.status(HTTPStatusCode.InternalServerError).end();
    });
    super.ctor(www, httpHandles || [], secure || false);
  }

  add(domain, host){
    this.targets.push({ domain: domain, host: host }); 
    console.log("DOMAIN " + this.protocol + "://" + domain);
  }

  printTargets(){
    for(let i=0; i < this.targets.length; i++){
      this.info(this.targets[i]);
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

  //
  // Override onHttpRequestReceived
  //
  onHttpRequestReceived(req, res){
    if(this.blacklist.indexOf(req.ip()) == -1){
      this.info((new Date()).toString(), '-', req.ip() + " GRANT " + this.protocol + "://" + req.headers.host + ':' + this.server.address().port + req.url);
      this.checkForRedirects(req, res, () => {
        this.dispatch(req, res);
      });
    }
    else {
      this.info((new Date()).toString(), '-', req.ip() + " DENIED " + this.protocol + "://" + req.headers.host + ':' + this.server.address().port + req.url);
      res.status(HTTPStatusCode.InternalServerError).end("Your IP " + req.ip() + " has been blocked.");
    }
  }

  checkForRedirects(req, res, next){
    let headers = req.headers;
    if(headers){
      //let host = headers.host,
      //    parts = (host||'').split('.');
      //if(parts.length < 3){
      //  let location = 'https://www.' + host;
      //  console.log('redirecting...', location);
      //  res.redirect(location);
      //} 
      //else {
      next();
      //}
    }
  }

}
