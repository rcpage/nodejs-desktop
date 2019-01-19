using('System.Network.PublicFileService');
using('System.Network.HTTP.HTTPStatusCode');

class ssh2 extends Endpoint {

  static get SupportedMethods(){
    return ["open","close","read","write",
            "fastGet","fastPut","readFile","writeFile",
            "appendFile","exists","unlink","rename",
            "mkdir","rmdir","readdir","fstat",
            "stat","lstat","opendir","setstat",
            "fsetstat","futimes","utimes","fchown",
            "chown","fchmod","chmod","readlink",
            "symlink","realpath","ext_openssh_rename",
            "ext_openssh_statvfs","ext_openssh_fstatvfs",
            "ext_openssh_hardlink","ext_openssh_fsync"];
  }

  get Connection(){
    return this._connection;
  }

  static get path(){
    return ["/v1/ssh2", "/v1/ssh2/{action}"];
  }

  getHostCredentials(id, cb){
    let request = System.getModule('request');
    request.get({
      url : 'http://localhost:8090/v1/inventory/view?id='+id
    }, (err, response, body) => {
      if(cb) {
        cb(err, JSON.parse(body));
      }
    })
  }

  GET(){
    this.executeAction();
  }


  POST(){
    this.executeAction();
  }

  executeAction(){

    function $args(func) { 
      return (func + '')
        .replace(/[/][/].*$/mg,'') // strip single-line comments
        .replace(/\s+/g, '') // strip white space
        .replace(/[/][*][^/*]*[*][/]/g, '') // strip multi-line comments  
        .split('){', 1)[0].replace(/^[^(]*[(]/, '') // extract the parameters  
        .replace(/=[^,]+/g, '') // strip any ES6 defaults  
        .split(',').filter(Boolean); // split & filter [""]
    } 

    //
    // TODO: Secure this action
    //
    this.res.setHeader('Access-Control-Allow-Origin', '*');

    let accessId = this.getRequestParameter('id');
    let action = this.getRequestParameter('action');
    let port = this.getRequestParameter('port', 22);
    let startTime = Date.now();
    this.getHostCredentials(accessId, (err, result) => {
      if(err){
        this.res.json(err.stack);
        return; 
      }
      this._connection = result[0];
      this._connection.port = port;

      let took = Date.now() - startTime;
      console.log(`${action} took ${took}ms to load from database.`);
      //
      //
      //     
      var method = this.getMethod(action);
      if(method){
        var cmd_args = $args(method.constructor);
        var args = [];
        for(var i=0;i<cmd_args.length;i++){
          var arg = cmd_args[i],
              val = this.getRequestParameter(arg);
          //console.log('parameter...' + arg+"="+val);
          args.push(val);
        }
        method.constructor.apply(this, args);
      }
      else {
        console.log(`${action} not supported. Please type help command for more information.`);
        this.res.end();
      }
    });
  }

  SFTP(cmd, callback){
    var Client = System.getModule('ssh2').Client;
    var conn = new Client();
    conn.on('ready', () => {
      conn.sftp((err, sftp) => {
      	if(callback) callback(err, sftp, conn);
      });
    }).on('error', (err) => {
      this.sendErrorToClient(err);
    }).connect(this.Connection);
  }
  
  shell(command){
    var Client = System.getModule('ssh2').Client;
    var conn = new Client();
    conn.on('ready', () => {
      conn.exec(command, (err, stream) => {
        var responseData = '';
        var responseError = '';
        if (err) {
          this.sendErrorToClient(err);
          return; 
        }
        stream.on('close', (code, signal) => {
          this.res.json({ 
            error: responseError, 
            data: responseData, 
            message: {code: code, signal: signal} 
          });
          conn.end();
        }).on('data', (data) => {
          responseData += data + '\n';
        }).stderr.on('data', (data) => {
          responseError += data + '\n';
        });
      });
    }).on('error', (err) => {
      this.sendErrorToClient(err);
    }).connect(this.Connection);
  }

  EXE(cmd, args){
    this.SFTP(cmd, (err, sftp, conn) => {
      if (err) {
        this.sendErrorToClient(err);
        return; 
      }
      //
      //sftp command handle
      //
      sftp[cmd].apply(sftp, args);
    });
  }

  sendErrorToClient(err){
    this.res.status(HTTPStatusCode.InternalServerError)
      .json({
      error: err.message + "\n\n" + err.stack 
    });
  }

  getMethod(name){
    var methods = this.getMethods(),
        m = methods[name];
    return m;
  }

  getMethods(){
    var methods = {};
    methods.readdir = {
      constructor: this.readdir
    };
    methods.mkdir = {
      constructor: this.mkdir
    };
    methods.rmdir = {
      constructor: this.rmdir
    };
    methods.unlink = {
      constructor: this.unlink
    };
    methods.rename = {
      constructor: this.rename
    };
    methods.fastGet = {
      constructor: this.fastGet
    };
    methods.fastPut = {
      constructor: this.fastPut
    };
    
    methods.stat = {
      constructor: this.stat
    };
    methods.lstat = {
      constructor: this.lstat
    };
    methods.chown = {
      constructor: this.chown
    };
    methods.chmod = {
      constructor: this.chmod
    };
    methods.readlink = {
      constructor: this.readlink
    };
    methods.symlink = {
      constructor: this.symlink
    };
    methods.realpath = {
      constructor: this.realpath
    };
    
    methods.shell = {
      constructor: this.shell
    };
    return methods;
  }
  
  readdir(path) {
    this.EXE("readdir", [path, (err, list) => {
      if(err){
        this.sendErrorToClient(err);
        return;
      }
      this.res.json(list);
    }]);
  }

  mkdir(path, attributes) {
    this.EXE("mkdir", [path, (err) => {
      if(err){
        this.sendErrorToClient(err);
        return;
      }
      this.res.json({ message: `'${path}' has been created.` });
    }]);
  }

  rmdir(path) {
    this.EXE("rmdir", [path, (err) => {
      if(err){
        this.sendErrorToClient(err);
        return;
      }
      this.res.json({ message: `'${path}' has been removed.` });
    }]);
  }

  unlink(path) {
    this.EXE("unlink", [path, (err) => {
      if(err){
        this.sendErrorToClient(err);
        return;
      }
      this.res.json({ message: `'${path}' has been removed.` });
    }]);
  }

  rename(path, newPath) {
    this.EXE("rename", [path, newPath, (err) => {
      if(err){
        this.sendErrorToClient(err);
        return;
      }
      this.res.json({ message: `'${path}' has been renamed to '${newPath}'.` });
    }]);
  }

  fastGet(remotePath, options, download) {
    let localPath = this.getLocalFileCacheLocation(remotePath),
        localPathParts = localPath.split('/'),
        //remove filename from localPathParts
        filename = localPathParts.pop(),
        //join localPathParts to create localDestDir
        localDestDir = localPathParts.join('/'),
        mkdirp = System.getModule('mkdirp');
    //
    // Note: to avoid i/o error, make directories to localPath
    // before writing to disk.
    //
    mkdirp.sync(localDestDir);
    //
    // write remotePath to localPath
    //
    this.EXE("fastGet", [remotePath, localPath, options, (err) => {
      if(err){
        this.sendErrorToClient(err);
        return;
      }
      if(download){
        this.res.setHeader('Content-Disposition', "attachment; filename=\"" + filename +"\"");
      }
      PublicFileService.streamFile(localPath, this.req, this.res, null, ()=>{
        console.log(`'${remotePath}' has been saved to '${localPath}'.`);
      }); 
    }]);
  }

  fastPut(remotePath, options) {
    let localPath = this.getLocalFileCacheLocation(remotePath);
    //
    // upldate localPath with req.post.body content
    //
    System.writeFile(localPath, this.req.post.body);
    //
    // upload localPath to removePath
    //
    this.EXE("fastPut", [localPath, remotePath, options, (err) => {
      if(err){
        this.sendErrorToClient(err);
        return;
      }
      this.res.json({ error:err, message: `File has beend uploaded to ${remotePath}.` });  
    }]);
  }
  
  open(path, flags, attrs_mode) {
    this.EXE("open", [path, flags, attrs_mode, (err, file) => {
      if(err){
        this.sendErrorToClient(err);
        return;
      }
      file.pipe(this.res);
    }]);
  }
  
  close(file_buffer) {
    this.EXE("close", [file_buffer, (err) => {
      if(err){
        this.sendErrorToClient(err);
        return;
      }
      this.res.json({ message: 'File buffer has been closed.'});
    }]);
  }
  
  stat(path) {
    this.EXE("stat", [path, (err, stats) => {
      if(err){
        this.sendErrorToClient(err);
        return;
      }
      this.res.json(stats);
    }]);
  }
  
  lstat(path) {
    this.EXE("lstat", [path, (err, stats) => {
      if(err){
        this.sendErrorToClient(err);
        return;
      }
      this.res.json(stats);
    }]);
  }
  
  chown(path, uid, gid) {
    this.EXE("chown", [path, uid, gid, (err) => {
      if(err){
        this.sendErrorToClient(err);
        return;
      }
      this.res.json({message: `'${path}' owners have been set to '${uid} ${gid}'.`});
    }]);
  }
  
  chmod(path, mode) {
    this.EXE("chmod", [path, mode, (err) => {
      if(err){
        this.sendErrorToClient(err);
        return;
      }
      this.res.json({message: `'${path}' has been set to '${mode}'.`});
    }]);
  }
  
  readlink(path) {
    this.EXE("readlink", [path, (err, target) => {
      if(err){
        this.sendErrorToClient(err);
        return;
      }
      this.res.json({ target: target });
    }]);
  }
  
  symlink(targetPath, linkPath) {
    this.EXE("symlink", [targetPath, linkPath, (err) => {
      if(err){
        this.sendErrorToClient(err);
        return;
      }
      this.res.json({ linkPath:linkPath, symlink: targetPath });
    }]);
  }
  
  realpath(path) {
    this.EXE("realpath", [path, (err, absPath) => {
      if(err){
        this.sendErrorToClient(err);
        return;
      }
      this.res.json({ realpath:absPath });
    }]);
  }
  
  getLocalFileCacheLocation(filepath, rootDirectory){
    let host = this.Connection.host,
        downloadDirectory = (rootDirectory || global.rootDirectory) + '/file-cache',
        sourcePaths = filepath.split('/'),
        filename = sourcePaths.pop(),
        destDir = downloadDirectory + '/' + host + sourcePaths.join('/'),
        cacheDest = destDir + '/' + filename;
    return cacheDest;
  }

}
















