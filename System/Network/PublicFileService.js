using('System.Network.PublicServer');
using('System.Network.HTTP.HTTPStatusCode');

class PublicFileService extends PublicServer {
  
  ctor(rootDirectory){
	this.www = rootDirectory;
    super.ctor();
  }
  
  getFullpath(req){
    return this.www + req.URL.pathname;
  }

  canSendFile(req){
    let fullpath = this.getFullpath(req);
    if(System.isFile(fullpath)){
      return true;
    }
    return false;
  }

  sendFile(fullpath, req, res, onComplete){
    if(System.isFile(fullpath)){
      req.isFile = true;
      if(PublicFileService.streamFile(fullpath, req, res, null, onComplete)){
        return true;
      }
    }
    return false;
  }

  handleHttpRequest(req, res){
    this.serviceFileRequest(req, res);
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

  }

  onFileSent(req, res){

  }
  
  static streamFile(fullpath, req, res, contentType, onComplete) {
    let sent = false;
    try {
      let file = System.getModule('fs').createReadStream(fullpath);
      file.on('close', function close(){ if(onComplete) onComplete(); });
      if(file) {
        this.pipeFileHandle(fullpath, file, req, res);
        sent = true;
      }
    } 
    catch(err){
      console.error('ERROR: PublicFileService.streamFile', err);
    }
    return sent;
  }

  static pipeFileHandle(fullpath, file, req, res){
    if(file) {
      const ext = System.getModule('path').parse(fullpath).ext;
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



