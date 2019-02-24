class System {

  static get Algorithm(){
    return "aes-256-gcm";
  }

  static get Key(){
    return "414f70ae339e8a25fee6fe68bb609cc5";
  }
  //credit: https://stackoverflow.com/questions/1714786/query-string-encoding-of-a-javascript-object
  static serialize(obj, prefix) {
    var str = [],
      p;
    for (p in obj) {
      if (obj.hasOwnProperty(p)) {
        var k = prefix ? prefix + "[" + p + "]" : p,
          v = obj[p];
        str.push((v !== null && typeof v === "object") ?
          this.serialize(v, k) :
          encodeURIComponent(k) + "=" + encodeURIComponent(v));
      }
    }
    return str.join("&");
  }


  static getTemplateParameters(string){
    if(typeof string == "string"){
      return string.match(/{{[^\s^{]+}}/g);
    }
    else {
      throw new Error("getTemplateParameters: Template source not valid.");
    }
  }

  static clearTemplateParameters(string){
    if(typeof string == "string"){
      var variables = System.getTemplateParameters(string);
      for(var i in variables) {
        //console.log('replacing...', variables[i], 'with empty string.');
        string = string.replace(new RegExp(variables[i],'g'), '');
      }
    }
    else {
      throw new Error("clearTemplateParameters: Template source not valid.");
    }
    return string;
  }

  static renderTemplate(source, context){
    if(this.isFile(source)){
      let file = this.readFile(source).toString();
      for(var name in context) {
        //console.log('replacing...', name, 'with', context[name]);
        file = file.replace(new RegExp('{{'+name+'}}','g'), context[name]);
      }
      file = System.clearTemplateParameters(file);
      return file;
    }
    else {
      throw new Error("renderTemplate: Template source not valid.");
    }
  }

  static encrypt(text){
    var iv = this.getRandomString(12); //initialization vector
    var cipher = crypto.createCipheriv(this.Algorithm, this.Key, iv);
    var encrypted = cipher.update(text, 'utf8', 'hex')
    encrypted += cipher.final('hex');
    var tag = cipher.getAuthTag();
    return {
      content: encrypted,
      tag: tag,//auth tag
      iv: iv //initialization vector
    };
  }

  static decrypt(encrypted) {
    var decipher = crypto.createDecipheriv(this.Algorithm, this.Key, encrypted.iv);
    var authTagBase64 = typeof encrypted.tag == 'string' ? encrypted.tag : encrypted.tag.toString('base64');
    decipher.setAuthTag(Buffer.from(authTagBase64, 'base64'));
    var dec = decipher.update(encrypted.content, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
  }
  
  static getRandomString(length){
    length = length || 12;
    var crypto = require('crypto');
    return crypto.randomBytes(Math.ceil(length/2))
      .toString('hex') /** convert to hexadecimal format */
      .slice(0,length);   /** return required number of characters */
  }

  static sha512(password, salt){
    var result = {
      salt:"",
      hash:""
    };
    try {
      var crypto = require('crypto');
      var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
      hash.update(password);
      var value = hash.digest('hex');
      result.salt = salt;
      result.hash = value;
    }
    catch(err){
      console.log('Method: System.sha512 - ', err);
    }
    return result;
  }




  static createPassword(password, callback) {
    var salt = System.getRandomString(16);
    if(callback) callback(System.sha512(password, salt));
  }

  static comparePassword(password, hash, salt){
    let sha512 = System.sha512(password, salt);
    if(sha512){
      return hash == sha512.hash;
    }
    return false;
  }

  static start(){
    //important!
    //Needed in class types
    global.using = System.require;
    global.mongo = System.getModule('/stack/models/mongo');
    global.crypto = System.getModule('crypto');
  }

  static isJsonString(str){
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  static getModule(moduleName, clearCache){
    var module = null;
    try {
      var filename = require.resolve(moduleName);
      if(clearCache) {
        if(require.cache[filename]){
          delete require.cache[filename];
          console.log('Module', '"'+moduleName+'"', 'cache cleared.');
        }
      }
      if(!require.cache[filename]) {
        System.onModuleLoaded(moduleName);
      }
      module = require(moduleName);
    } catch(e) {
      console.error('Error loading module', '"'+moduleName+'".');
    }
    return module;
  }

  static onModuleLoaded(moduleName){
    //console.log('Module', '"'+moduleName+'"', 'loaded into system cache.');
  }

  static getLoadedModules(){
    return require.cache;
  }

  static readFile(path){
    if(!System.isFile(path)){
      console.error('Path not a file.', path);
      return null;
    }
    return System.fs.readFileSync(path);
  }

  static writeFile(path, value){
    let error = undefined;
    try {
      System.fs.writeFileSync(path, value);
    }
    catch(err){
      error = err;
    }
    return error;
  }

  static eval(script){
    return System.evalScript(Syste.vm, script);
  }

  static evalInContext(context, script){
    return function(code){
      return eval(code);
    }.call(context, script);
  }

  static evalScript(vm, source, ref){
    if(source == null || vm == null) return undefined;
    var result = undefined;
    try {
      var script = new vm.Script(source);
      result = script.runInThisContext();
    } catch(error) {
      console.error('Warning:', error.message, ref, error);
    }
    return result;
  }

  static makeEvalContext (declarations) {
    //Example:
    //eval1 = makeEvalContext ("var x;");
    //eval2 = makeEvalContext ("var x;");

    //eval1("x = 'first context';");
    //eval2("x = 'second context';");
    //eval1("window.alert(x);");
    //eval2("window.alert(x);");
    eval(declarations);
    return function (code) { eval(code); }
  }

  static runScript(vm, context, source){
    if(source == null || vm == null || context == null) return undefined;
    return vm.runInContext(source, context);
  }

  static require(path){
    return System.load(System.vm, path);
  }

  static load2(vm, ref){
    var resolveRef = System.resolveRef(ref);
    //console.log('resolving ref', ref);
    if(resolveRef.isValid){
      var path = resolveRef.path;
      //console.log('path is valid', path);
      if(resolveRef.isDir){
        var dir = path;
        var paths = System.readDirectory(dir);
        for(var i in paths) {
          var dirPath = paths[i];
          if(System.isDirectory(dirPath)){
            this.load2(vm, dirPath);
          }
          else {
            if(System.Types.indexOf(dirPath) == -1){
              System.createGlobalNamespace(dirPath);
              var type = System.evalScript(vm, System.readFile(dirPath), dirPath);
              System.Types.push(dirPath);
              console.log(resolveRef.namespace.replace('.js',''));
            } else {
              //console.log("Type has been evaluated.", 'Skipping', '"'+ filename +'".'); 
            }
          }
        }
      }  
      else if(resolveRef.isFile){
        if(System.Types.indexOf(path) == -1){
          System.createGlobalNamespace(path);
          var type = System.evalScript(vm, System.readFile(path), path);
          System.Types.push(path);
          console.log(resolveRef.namespace.replace('.js',''));
        } else {
          //console.log("Type has been evaluated.",'Skipping', '"'+ filename +'".'); 
        }
      }
    } else {
      console.error('reference not valid', ref, resolveRef); 
    }
  }

  static get isWindows(){
    return /^win/.test(process.platform);
  }

  static get PathSeparator(){
    return System.isWindows ? "\\" : "/";
  }


  static load(vm, ref){
    System.load2(vm, ref);
  }

  static resolveRef(ref){

    if(System.isWindows) ref = ref.replace(new RegExp('/','g'), '\\');
    var slash =  System.PathSeparator;
    var path = ref.split('.').join(slash).replace(slash + 'js', '.js');
    var filename = path.startsWith(__dirname) ? path : __dirname + slash + path;
    var isDir = false, isFile = false;
    var namespace = path.replace(new RegExp('\\\\|/','g'), '.');
    if(System.isFile(filename)){
      isFile = true;
    } else if(System.isFile(filename+ ".js")){
      isFile = true;
      filename += '.js';
    }
    else if(System.isDirectory(filename)){
      isDir = true;
    }
    else {
      //does not exists.
    }
    var isValid = isDir == true || isFile == true;
    return { ref:ref, path: filename, isDir: isDir, isFile: isFile, isValid: isValid, namespace: namespace };
  }

  static isFile(path){
    var exists = false;
    try {
      exists = System.fs.lstatSync(path).isFile();
    } catch(e){
      //console.error('File.Exists', e.stack);
    }
    return exists;
  }

  static isFunction(functionToCheck) {
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
  }

  static isDirectory(path){
    var exists = false;
    try {
      exists = System.fs.lstatSync(path).isDirectory();
    } catch(e){
      //console.error('Directory.Exists', e.stack);
    }
    return exists;
  }

  static readDirectory(dir, sourceList, deep){
    function stortByDirectory(a, b) {
      try {
        var aIsDir = System.fs.statSync(dir + "/" + a).isDirectory(),
            bIsDir = System.fs.statSync(dir + "/" + b).isDirectory();

        if (aIsDir && !bIsDir) {
          return -1;
        }

        if (!aIsDir && bIsDir) {
          return 1;
        }

        return a.toLowerCase() < b.toLowerCase() ? -1 : 1;
      }
      catch(err){
        return false; 
      }
    }
    var list = sourceList || [];
    try {
      var files = System.fs.readdirSync(dir).sort(stortByDirectory);
      for(var i in files){
        var file = files[i];
        var path = dir + "/" + file;
        var isDir = System.fs.statSync(path).isDirectory();
        if(!isDir){
          list.push(path);
        }
        else {
          if(deep){
            list = System.readDirectory(path, list, deep);
          }
          else {
            list.push(path);
          }
        }
      }
    } 
    catch(e){

    }
    return list;
  }

  static Instantiate(filename){
    var result = function(){}; 
    try {
      var source = System.readFile(filename).toString();
      result = eval(source);
    } catch(dontCare){
      console.error(dontCare);
    } 
    return result; 
  };

  static createGlobalNamespace(filename, type){
    var parts = filename.split('/');//.splice(2);
    //reference global namespace;
    var Instantiate = function(){
      var result = function(){}; 
      try {
        var source = System.readFile(filename).toString();
        result = eval(source);
      } catch(dontCare){
        console.error(dontCare);
      } 
      return result; 
    };
    var root = System.Namespace;
    for(var i in parts){
      var scope = parts[i];
      var typeName = scope;
      if(scope.endsWith('.js')){
        typeName = scope.replace('.js', '');
        if(!root[typeName]) 
          root[typeName] = Instantiate;
        root = root[typeName]  ? root[typeName] : root;
      } else {
        if(!root[scope]) 
          root[scope] = {};
        root = root[scope]  ? root[scope] : root;
      }
    }
    //copy namespace reference to global context
    for(var name in System.Namespace){
      global[name] = System.Namespace[name];
    }
  }

  static sendEmail(fullName, address, subject, message, callback){
    let mail = System.getModule('/stack/models/email');
    mail.sendGmail.apply(mail, arguments);
  }

  static notifyAdmin(firstName, lastName, address, phone, message){
    let mail = System.getModule('/stack/models/email');
    mail.contactUs(firstName, lastName, address, phone, message);
  }

  static Authenticate(subject, credentials){
    let http = System.getModule('http');
    http.get('http://localhost:5050/ldap?subject='+subject+'&credentials='+credentials, function(err, result){
      console.log(result);
    });
  }

  static getByteSizeByUnit(size, unit){
    let value = 0;
    let KB = 1024,		//bytes
        MB = 1024 * KB, //bytes
        GB = 1024 * MB, //bytes
        TB = 1024 * GB; //bytes
    switch(unit){
      case "TB":
        value = size * TB;
        break;
      case "GB":
        value = size * GB;
        break;
      case "MB":
        value = size * MB;
        break;
      case "KB":
        value = size * KB;
        break;
      default:
        unit = 1;
        break;
    }
    return value;
  }


  static CreateVirtualFileSystem(filepath, size, format){
    let block_size = 512,
        count = size / block_size;
    format = format || 'ext4';
    System.Run("sh", ['-c', 'dd if=/dev/zero of=' + filepath + ' count=' + count], dd => {
      console.log(dd);
      System.Run("sh", ['-c', 'mkfs -t '+format+' -q ' + filepath + " -F"], mkfs=>{
        console.log(mkfs);
      });
    });
  }

  static MountVirtualFileSystem(src, path){
    System.Run("sh", ['-c', 'mount -o loop,rw,usrquota,grpquota ' + src + ' ' + path], mount => {
      console.log(mount);
    });
  }

  static RemoveVirtualFileSystem(path){
    System.Run("sh", ['-c', 'umount ' + path], umount => {
      console.log(umount);
    });
  }

  static AddUser(user, password, salt, cb){
    password = salt ? "-salt " + salt + " " + password : password;
    System.Run("sh", ["-c", "openssl passwd -1 " + password], openssl => {
      System.Run("sh", ["-c", "useradd -p '"+openssl.stdout.trim()+"' -s /bin/bash -m " + user], useradd => { 
        //System.Run("sh", ["-c", "adduser --quiet --disabled-password --shell /bin/bash --home /media/rusty/500GB/users --gecos 'User' " + user], useradd => { 
        if(cb) cb(useradd);
      });
    });
  }

  static ChangePassword(user, password, cb){
    System.Run("sh", ['-c', "echo '"+user+":"+password+"' | chpasswd"], chpasswd => {
      if(cb) cb(chpasswd);
    });
  }

  static RemoveUser(user, cb){
    System.Run("sh", ["-c", "userdel " + user], userdel => { 
      if(cb) cb(userdel);
    });
  }

  static Run(cmd, args, onClose){
    let startTime = Date.now();
    let currentWorkingDirectory = "/";
    let { spawn } = System.getModule('child_process');
    let child = null;
    try {
      if(cmd && args){
        let stdout = "",
            stderr = "",
            completeHandle = function(){
              if(onClose) {
                onClose({ 
                  cmd: cmd + " " + args.join(" "), 
                  stdout: stdout.trim(), 
                  stderr: stderr.trim(),
                  latency: Date.now() - startTime,
                  timestamp: Date.now()
                });
              }
            };

        child = spawn(cmd, args, { cwd: currentWorkingDirectory });

        child.on('close', (code, signal) => { 
          completeHandle();
        });

        child.on('exit', (code, signal) => { 

        });

        child.on('error', (err) => { 
          stderr += err.stack
        });

        child.stdout.on('data', (data) => {
          stdout += data;
        });

        child.stdout.on('error', function( err ) {
          if (err.code == "EPIPE") {
            child.exit(0);
          }
        });

        child.stderr.on('data', (data) => {
          stderr += data;
        });

        child.stdout.on('close', () => {

        });

        child.stderr.on('close', () => {

        });

        child.unref();
      }
    }
    catch(err){
      stderr += err.stack;
      completeHandle();
    }
    //return child;
  }



}
System.Namespace = {};
System.Types = [];
System.fs = System.getModule('fs');
System.vm = System.getModule('vm');                                    
System.start();
module.exports = System;



