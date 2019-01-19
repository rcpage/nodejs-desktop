using('System.Network.HTTP.js');
using('System.Network.HTTP.HTTPStatusCode.js');

class FileService extends HTTP {

  ctor(www, secure) {
    if(!www) throw new Error("Root file path required.");
    this.www = www;
    /*
    this.fileCache = Object.create(null);
    var list = System.readDirectory(www);
    this.fileCacheSize = 0;
    for(var i in list) {
      this.fileCache[list[i]] = System.readFile(list[i]);
      this.fileCacheSize += this.fileCache[list[i]].length;
    }
    */
    super.ctor(secure);
  }

  getFullpath(req){
    return this.www + req.URL.pathname;
  }

  canSendFile(req){
    let fullpath = this.getFullpath(req);
    if(System.isFile(fullpath) || System.isFile(fullpath + "index.html")){
      return true;
    }
    return false;
  }

  sendFile(fullpath, req, res, onComplete){
    if(System.isFile(fullpath)){
      req.isFile = true;
      if(HTTP.streamFile(fullpath, req, res, null, onComplete)){
        return true;
      }
    }
    else if(System.isFile(fullpath + "index.html")){
      fullpath += "index.html";
      req.isFile = true;
      if(HTTP.streamFile(fullpath, req, res, "text/html", onComplete)){
        return true;
      }
    }
    return false;
  }

  handleHttpRequest(req, res){
    this.serviceFileRequest(req, res);
    //call HTTP.handleHttpRequest
    super.handleHttpRequest(req, res);
  }

  serviceFileRequest(req, res){
    let filename = this.getFullpath(req),
        fileSentHandle = () => { 
          this.onFileSent(req, res); 
        };
    if(this.sendFile(filename, req, res, fileSentHandle)){
      this.onFileExists(req, res);
    } else {
      this.onFileNotFound(req, res);
    }
  }

  onFileNotFound(req, res){
    res.status(HTTPStatusCode.NotFound).end("File Not Found");
  }

  onFileExists(req, res){
    //this.info('File exits', this.getFullpath(req));

  }

  onFileSent(req, res){
    //this.info('File sent', this.getFullpath(req));
    this.onHttpRequestComplete(req, res);
  }

  streamFileBuffer(fullpath, req, res, contentType, onComplete){
    let sent = false;
    if(this.fileCache[fullpath]){
      let streamBuffers = System.getModule('stream-buffers');
      let file = new streamBuffers.ReadableStreamBuffer();
      file.put(this.fileCache[fullpath]);
      try {
        file.on('close', function close(){ if(onComplete) onComplete(); });
        if(file) {
          HTTP.pipeFileHandle(fullpath, file, req, res);
          sent = true;
        }
      } 
      catch(err){
        console.error('ERROR: HTTP.streamFile', err);
      }
    }
    else {
      return HTTP.streamFile(fullpath, req, res, contentType, onComplete);
    }
    return sent;
  }
}















