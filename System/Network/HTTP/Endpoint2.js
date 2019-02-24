class Endpoint {

  static get protocol(){
		return this.req.isHTTPS() ? "https":"http";
  }
  
  static get version(){
    return "0.0.0";
  }

  static get path(){
    return [];
  }

  static run(req, res){
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
  
  static getRequestParameter(name, defaultValue){
  	return this.req.post[name] || this.req.query[name] || this.req.pathParam[name] || defaultValue; 
  }

  static GET(){
    this.printVersion();
  }

  static POST(){
    this.printVersion();
  }

  static PUT(){
    this.printVersion();
  }

  static HEAD(){
    this.printVersion();
  }

  static DELETE(){
    this.printVersion();
  }

  static OPTIONS(){
    this.printVersion();
  }

  static CONNECT(){
    this.printVersion();
  }

  static printVersion(){
    this.registerHttpRequestStats();
    //let version = this.req.headers.host + " > " + this.req.url + " > HTTP " + this.req.method + ' > '+this.name +  ' > v' + this.version;
    //this.res.end(version);
    this.defaultHttpResponse();
  }
  
  static acknowledgeHttpRequest(){
    this.req.acknowlegeTime = Date.now();
    this.req.timeToAcknowlege = this.req.acknowlegeTime - this.req.httpRequestRecievedTime;
  }

  static registerHttpRequestStats(){
    this.req.completeTime = Date.now();
    this.req.latency = this.req.completeTime - this.req.startTime;
    //console.log('startTime', this.req.startTime, 'latency', this.req.latency);
  }
  
  static defaultHttpResponse(){
    let transactionInfo = [
      '<h1>' + this.name + '</h1>',
      'URL: '+ this.protocol + "://" + this.req.headers.host + this.req.url,
      "Date: "+(new Date()).toString(), 
      "Method: "+this.req.method,
      'Version: ' + this.version,
      'Latency: ' + this.req.latency + 'ms', 
      'Client IP: ' + this.req.ip()].join('<br/>');
    
    this.res.setHeader('content-type', 'text/html');
    this.res.end(transactionInfo);
  }

}



