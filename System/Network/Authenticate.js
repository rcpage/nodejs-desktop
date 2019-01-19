using('System.Server');
using('System.Network.HTTP.HTTPStatusCode');

class Authenticate {

  static isSessionAuthorized(req) {
    let isAuth = (req.session && req.session.authorized == true) || false;
    return isAuth;
  }

  static isSignOnRequsted(req, res){
    let returnValue = req.query.signon && req.query.signon.toString() == "true";
    return  returnValue;
  }

  static check(req, res, cb){
    if(this.authorizationRequestedByUser(req, res)){
      req.userAuth = true;
      this.authenticate(req, res, cb);
    }
    else if(this.checkRequestQueryForLogOff(req, res)){
      req.userLogOff = true;
      this.onLogoff(req, res);
    }
    else {
      if(this.isSessionAuthorized(req)){
        this.onCheckComplete(req, res, cb);
      } else {
        console.log((new Date()).toString(), '-', req.ip() + ' UNAUTHORIZED http://' + req.headers.host + req.url);
        req.deniedAccess = true;
        this.onAuthorizationRequired(req, res);
      }
    }
  }

  static checkRequestQueryForLogOff(req, res){
    if(req.query.logoff && req.query.logoff.toString() == "true"){
      return true;
    }
    return false;
  }

  static authorizationRequestedByUser(req, res){
    let credentials = this.getUserCredentials(req);
    let authorizedSession = this.isSessionAuthorized(req);
    let isPostRequest = req.method == "POST" ? true : false;
    //if(credentials && !authorizedSession && isPostRequest && req.post.cmd.startsWith("login")){
    if(credentials && !authorizedSession){
      return true;
    }

    return false;
  }

  static authenticate(req, res, cb){
    this.serverAuthentication(req, res, cb);
  }

  static serverAuthentication(req, res, cb){
    let http = this;
    let credentials = this.getUserCredentials(req, res);
    let pair = credentials.split(':');
    if(pair.length == 2) {
      let user = pair[0];
      let password = pair[1];
      req.user = user;
      function onSuccessHandle()  { http.onAuthSuccess(req, res, cb); }
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

  static deleteSessionAuth(req, res){
    delete req.session.authorized;
    delete req.session.user;
  }

  static getUserCredentials(req, res){
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

  static onCheckComplete(req, res, cb){
    if(cb) cb(req, res);
    else throw new Error("Authentic.onCheckComplete is missing callback handle.");
  }

  static onAuthSuccess(req, res, cb){
    req.session.authorized = true;
    req.session.user = req.user;
    this.onCheckComplete(req, res, cb);
  }

  static onAuthError(req, res, err){
    req.authError = err;
    this.deleteSessionAuth(req, res);
    this.onAuthorizationRequired(req, res);
  }

  static onLogoff(req, res){
    this.deleteSessionAuth(req, res);
    this.onAuthorizationRequired(req, res);
  }

  static onAuthorizationRequired(req, res){
    res.statusCode = HTTPStatusCode.NotAuthorized;
    if(this.isSignOnRequsted(req, res)) {
      res.setHeader('WWW-Authenticate', 'Basic realm="This site requires authorization."');
    }
    res.setHeader('Content-type', "text/html");
    res.end('<h1>Not Authorized</h1>');
  }
}


