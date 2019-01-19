using('System.Shell');
using('System.Network.HTTP.ServiceManager');
class SecureServer extends ServiceManager {

  ctor(www, handles, https){
    handles.unshift(Shell);
  	super.ctor(www, handles, https);
  }
  
  stdout(req, value){
    if(value){
      global.stdout[this.requestId(req)] = value;
    }
    else {
      if(global.stdout[this.requestId(req)] == undefined){
        global.stdout[this.requestId(req)] = [];
      }
      return global.stdout[this.requestId(req)];
    }
  }

  stderr(req, value){
    if(value){
      global.stderr[this.requestId(req)] = value;
    }
    else {
      if(global.stderr[this.requestId(req)] == undefined){
        global.stderr[this.requestId(req)] = [];
      }
      return global.stderr[this.requestId(req)];
    }
  }

  currentWorkingDirectory(req, value){
    if(value){
      global.currentWorkingDirectory[this.requestId(req)] = value;
    }
    else {
      if(!global.currentWorkingDirectory[this.requestId(req)]){
        global.currentWorkingDirectory[this.requestId(req)] = "/";
      }
      return global.currentWorkingDirectory[this.requestId(req)];
    }
  }

  shell(req, value){
    if(value){
      global.shell[this.requestId(req)] = value;
    }
    else {
      if(global.shell[this.requestId(req)] == undefined){
        global.shell[this.requestId(req)] = [];
      }
      return global.shell[this.requestId(req)];
    }
  }

  requestId(req){
    let id = req.sessionID + req.url.pathname;
    //console.log('reqID = ' + id );
    return id;
  }

  onAuthorizationRequired(req, res){
    this.log(req.url.path , 'onAuthorizationRequired');
    if(req.method == "POST"){
      
      if(req.post.cmd && !req.post.cmd.startsWith('login')){
        this.shell(req).push({ 
          cmd: req.post.cmd,
          args: [], 
          index: this.shell(req).length, 
          pid: "",
          cwd: this.currentWorkingDirectory(req),
          timestamp: Date.now(),
          close: {},
          error: {}
        });
        this.stdout(req).push("");
        this.stderr(req).push("request not authorized");
      }
     
     
      if(req.post.cmd == 'login' && !req.authError){
        //post.cmd starts with login
        console.log("WWW-Authenticate requsted by user.");
        res.setHeader('WWW-Authenticate', 'Basic realm="This site requires authorization."');
      }
      else {
        if(req.authError){
          this.shell(req).push({
            cmd: 'login ********',
            args: [], 
            index: this.shell(req).length, 
            pid: "",
            cwd: this.currentWorkingDirectory(req),
            timestamp: Date.now(),
            close: {},
            error: {}
          });
          this.stdout(req).push("");
          this.stderr(req).push("access denied"); 
        }
      }
    }
    res.status(HTTPStatusCode.NotAuthorized);
    let handle = new Shell(req, res);
  }

}






