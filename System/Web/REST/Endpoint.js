class Endpoint {

  static get path(){
    return "/";
  }

  get isComplete(){
    if(this.async == undefined || this.async == false) {
      return true;
    }
    else {
      return false;
    }
  }

  constructor(){
    this.ctor.apply(this, arguments);
  }

  ctor(req, res, defaultResponse, onCompleteEventHandle){
    req.isService = true;
    this.onCompleteEventHandle = onCompleteEventHandle;
    this.req = req;
    this.res = res;
    this.httpResponse = defaultResponse;
    this.service();
  }

  service(){
    switch(this.req.method){
      case "GET":
        this.onGet();
        break;
      case "POST":
        this.onPost();
        break;
      case "HEAD":
        this.onHead();
        break;
      case "PUT":
        this.onPut();
        break;
      case "DELETE":
        this.onDelete();
        break;
      case "OPTIONS":
        this.onOptions();
        break;
      case "CONNECT":
        this.onConnect();
        break;
    }
    if(this.isComplete) this.onComplete();
    //else console.log("Warning: Async HTTP handle waiting to be closed...");
  }

  onPost(){

  }

  onGet(){

  }

  onHead(){

  }

  onPut(){

  }

  onDelete(){

  }

  onOptions(){

  }

  onConnect() {

  }

  onComplete(){
    if(this.isComplete){
      if(this.redirect != undefined){
        this.res.redirect(this.redirect);
      }
      else {
        if(typeof this.httpResponse == "string") {
          this.res.end(this.httpResponse);
        }
        else {
          this.res.json(this.httpResponse);
        }
      }
      if(this.onCompleteEventHandle) this.onCompleteEventHandle();
    } else {
      throw new Error("Handle not complete.");
    }
    //console.log("Handle.onComplete");
  }

  dispose() {
    delete this.req;
    delete this.res;
    delete this.httpResponse;
  }
}


















































