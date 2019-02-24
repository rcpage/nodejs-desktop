class Endpoint {

  get protocol(){
		return this.req.isHTTPS() ? "https":"http";
  }
  
  get version(){
    return "0.0.0";
  }

  static get path(){
    return [];
  }
 
  onComplete(){
    if(this._completeHandle){
      this._completeHandle();
    }
  }
  
  constructor(){
  	this.ctor.apply(this, arguments);
  }
  
  ctor(req, res, done){
  	this.run(req, res);
    this._completeHandle = done;
  }

  run(req, res){
    this.req = req;
    this.res = res;
    let fn = this[req.method];
    if(fn){
      try {
        this.acknowledgeHttpRequest();
        fn.call(this);
      }
      catch(e){
		res.json(e);
      }
    }
    else {
      res.end("Method does not exist. " + req. method);
    }
  }
  
  getRequestParameter(name, defaultValue){
  	return this.req.post[name] || this.req.query[name] || this.req.pathParam[name] || defaultValue; 
  }

  GET(){
    this.printVersion();
  }

  POST(){
    this.printVersion();
  }

  PUT(){
    this.printVersion();
  }

  HEAD(){
    this.printVersion();
  }

  DELETE(){
    this.printVersion();
  }

  OPTIONS(){
    this.printVersion();
  }

  CONNECT(){
    this.printVersion();
  }

  printVersion(){
    this.registerHttpRequestStats();
    //let version = this.req.headers.host + " > " + this.req.url + " > HTTP " + this.req.method + ' > '+this.name +  ' > v' + this.version;
    //this.res.end(version);
    this.defaultHttpResponse();
  }
  
  acknowledgeHttpRequest(){
    this.req.acknowlegeTime = Date.now();
    this.req.timeToAcknowlege = this.req.acknowlegeTime - this.req.httpRequestRecievedTime;
  }

  registerHttpRequestStats(){
    this.req.completeTime = Date.now();
    this.req.latency = this.req.completeTime - this.req.startTime;
    //console.log('startTime', this.req.startTime, 'latency', this.req.latency);
  }
  
  defaultHttpResponse(){
    let transactionInfo = [
      '<h1>' + this.constructor.name + '</h1>',
      'URL: '+ this.protocol + "://" + this.req.headers.host + this.req.url,
      "Date: "+(new Date()).toString(), 
      "Method: "+this.req.method,
      'Version: ' + this.version,
      'Latency: ' + this.req.latency + 'ms', 
      'Client IP: ' + this.req.ip()].join('<br/>');
    
    this.res.setHeader('content-type', 'text/html');
    this.res.end(transactionInfo);
    this.onComplete();
  }

}



