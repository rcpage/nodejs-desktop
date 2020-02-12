using('System.Network.PublicFileService');
using('System.Network.HTTP.HTTPStatusCode');
class ssh extends Endpoint {

  static get path(){
    return "/v1/ssh";
  }

  static getHostCredentials(id, cb){
    let request = System.getModule('request');
    request.get({
      url : 'http://api.rusty.com/v1/inventory/view?id='+id
    }, (err, response, body) => {
      if(cb) {
        cb(err, JSON.parse(body));
      }
    })
  }

  static GET(){
    this.executeAction();
  }


  static POST(){
    this.executeAction();
  }

  static executeAction(){
    //
    // TODO: Secure this action
    //
    this.res.setHeader('Access-Control-Allow-Origin', '*');

    let accessId = this.req.query.id;
    let action = this.getRequestParameter('action', 'list');

    let user = '';
    let password = '';
    let host = '';
    let port = this.getRequestParameter('port', 22);

    let path = this.getRequestParameter('path', '/');
    let newPath = this.getRequestParameter('newPath');

    let source = this.getRequestParameter('source', '');
    let dest = this.getRequestParameter('dest', '');

    let command = this.getRequestParameter('command', '');

    let isDirectory = this.getRequestParameter('directory') == "true";
    let forceDownload = this.getRequestParameter('download') == "true";

    let mkdirp = System.getModule('mkdirp');

    //console.log('WTF', action, user, password, path, host);
    this.getHostCredentials(accessId, (err, credentials) => {

      host = credentials[0].host;
      user = credentials[0].username;
      password = credentials[0].password;

      let downloadDirectory = global.rootDirectory + '/file-cache';
      let sourcePaths = source.split('/');
      let filename = sourcePaths.pop();
      let destDir = downloadDirectory + '/' + host + sourcePaths.join('/');
      let cacheDest = destDir + '/' + filename;

      switch(action){
        case "rename":
          this.rename(host, port, user, password, path, newPath);
          break;
        case "mkdir":
          this.mkdir(host, port, user, password, path);
          break;
        case "delete":
          this.delete(host, port, user, password, path, isDirectory);
          break;
        case "list":
          this.readDirectory(host,port, user, password, path);
          break;	
        case "upload":
          dest = source;
          System.writeFile(cacheDest, this.req.post.body);
          this.fastPut(host, port, user, password, cacheDest, dest);
          break;
        case "download":
          mkdirp.sync(destDir);
          this.fastGet(host, port, user, password, source, cacheDest, forceDownload);
          break;
        case "exec":
          this.exec(host, port, user, password, command);
          break;
        default:
          this.res.json({ message:"Action not defined." });
          break;
      }
    });
  }

  static rename(host, port, user, password, path, newPath){
    var http = this;   
    var Client = System.getModule('ssh2').Client;
    var conn = new Client();
    var msg = [{ message: `'${path}' has been renamed to '${newPath}'.` }];
    conn.on('ready', function() {
      conn.sftp(function(err, sftp) {
        if (err) {
          http.res.status(HTTPStatusCode.InternalServerError)
            .json({
            error: err.stack 
          });
          return; 
        }
        //rename directory
        sftp.rename(path, newPath, function(err) {
          if (err) {
            http.res.status(HTTPStatusCode.InternalServerError)
              .json({
              error: err.stack 
            });
            return; 
          }
          http.res.json(msg);
          conn.end();
        });
      });
    }).on('error', function(err) {
      http.res.json({ error: err });
    }).connect({
      host: host,
      port: port,
      username: user,
      password: password
    });
  }

  static mkdir(host, port, user, password, path){
    var http = this;   
    var Client = System.getModule('ssh2').Client;
    var conn = new Client();
    var msg = [{ message: `'${path}' has been created.` }];
    conn.on('ready', function() {
      conn.sftp(function(err, sftp) {
        if (err) {
          http.res.status(HTTPStatusCode.InternalServerError)
            .json({
            error: err.stack 
          });
          return; 
        }
        //create directory
        sftp.mkdir(path, function(err) {
          if (err) {
            http.res.status(HTTPStatusCode.InternalServerError)
              .json({
              error: err.stack 
            });
            return; 
          }
          http.res.json(msg);
          conn.end();
        });
      });
    }).on('error', function(err) {
      http.res.json({ error: err });
    }).connect({
      host: host,
      port: port,
      username: user,
      password: password
    });
  }


  static delete(host, port, user, password, path, isDirectory){
    var http = this;   
    var Client = System.getModule('ssh2').Client;
    var conn = new Client();
    var msg = [{ message: `'${path}' has been deleted.` }];
    conn.on('ready', function() {
      conn.sftp(function(err, sftp) {
        if (err) {
          http.res.status(HTTPStatusCode.InternalServerError)
            .json({
            error: err.stack 
          });
          return; 
        }
        if(isDirectory){
          //delete directory
          sftp.rmdir(path, function(err) {
            if (err) {
              http.res.status(HTTPStatusCode.InternalServerError)
                .json({
                error: err.stack 
              });
              return; 
            }
            http.res.json(msg);
            conn.end();
          });
        }
        else {
          //delete file
          sftp.unlink(path, function(err) {
            if (err) {
              http.res.status(HTTPStatusCode.InternalServerError)
                .json({
                error: err.stack 
              });
              return; 
            }
            http.res.json(msg);
            conn.end();
          });
        }
      });
    }).on('error', function(err) {
      http.res.json({ error: err });
    }).connect({
      host: host,
      port: port,
      username: user,
      password: password
    });
  }


  static readDirectory(host, port, user, password, path){
    var http = this;   
    var Client = System.getModule('ssh2').Client;
    var conn = new Client();

    conn.on('ready', function() {
      conn.sftp(function(err, sftp) {
        if (err) {
          http.res.status(HTTPStatusCode.InternalServerError)
            .json({
            error: err.stack 
          });
          return; 
        }
        sftp.readdir(path, function(err, list) {
          if (err) {
            http.res.status(HTTPStatusCode.InternalServerError)
              .json({
              error: err.stack 
            });
            return; 
          }
          http.res.json(list);
          conn.end();
        });
      });
    }).on('error', function(err) {
      http.res.json({ error: err });
    }).connect({
      host: host,
      port: port,
      username: user,
      password: password
    });
  }

  static fastGet(host, port, user, password, remotePath, localPath, download){
    var Client = System.getModule('ssh2').Client;
    var conn = new Client();
    var http = this;
    var filename = localPath.split('/').pop();
    conn.on('ready', function() {
      conn.sftp(function(err, sftp) {
        if (err) {
          http.res.status(HTTPStatusCode.InternalServerError)
            .json({
            error: err.stack 
          });
          return; 
        }
        sftp.fastGet(remotePath, localPath, function(err) {
          if (err) {
            http.res.status(HTTPStatusCode.InternalServerError)
              .json({
              error: err.stack 
            });
            return; 
          }
          //http.res.json({ error:err, message:"File has beend downloaded." });
          if(download){
            http.res.setHeader('Content-Disposition', "attachment; filename=\"" + filename +"\"");
          }
          http.res.setHeader('file-cache', localPath);
          PublicFileService.streamFile(localPath, http.req, http.res, null, ()=>console.log(`File has been downloaded to ${localPath}.`)); 
          conn.end();
        });
      });
    }).on('error', function(err) {
      http.res.json({ error: err });
    }).connect({
      host: host,
      port: port,
      username: user,
      password: password
    });
  }

  static fastPut(host, port, user, password, localPath, remotePath){
    var Client = System.getModule('ssh2').Client;
    var conn = new Client();
    var http = this;
    conn.on('ready', function() {
      conn.sftp(function(err, sftp) {
        if (err) {
          http.res.status(HTTPStatusCode.InternalServerError)
            .json({
            error: err.stack 
          });
          return; 
        }
        sftp.fastPut(localPath, remotePath, function(err) {
          if (err) {
            http.res.status(HTTPStatusCode.InternalServerError)
              .json({
              error: err.stack 
            });
            return; 
          }
          http.res.json({ error:err, message:"File has beend uploaded." });
          conn.end();
        });
      });
    }).on('error', function(err) {
      http.res.json({ error: err });
    }).connect({
      host: host,
      port: port,
      username: user,
      password: password
    });
  }

  static exec(host, port, user, password, command){
    var Client = System.getModule('ssh2').Client;
    var conn = new Client();
    var http = this;
    conn.on('ready', function() {
      conn.exec(command, function(err, stream) {
        var responseData = '';
        var responseError = '';
        if (err) {
          http.res.status(HTTPStatusCode.InternalServerError)
            .json({
            error: err.stack 
          });
          return; 
        }
        stream.on('close', function(code, signal) {
          var msg = 'Stream :: close :: code: ' + code + ', signal: ' + signal;
          http.res.json({ error: responseError, data: responseData, message: msg });
          conn.end();
        }).on('data', function(data) {
          responseData += data + '\n';
        }).stderr.on('data', function(data) {
          responseError += data + '\n';
        });
      });
    }).on('error', function(err) {
      http.res.json({ error: err });
    }).connect({
      host: host,
      port: port,
      username: user,
      password: password
    });
  }
}
















