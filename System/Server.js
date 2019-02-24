class Server {
  static invoke(){
    return function(methodName, args){
      var mod = System.getModule('linux-user');
      var fn = mod[methodName];
      if(fn){
        return fn.apply(mod, args);
      }
    }
  }
  //linuxUser.addUser(username, callback)
  //username String
  //callback function(err, userInfo)
  static addUser(username, callback){
    return Server.invoke()("addUser", arguments);
  }
  //linuxUser.removeUser(username, callback)
  //username String
  //callback function(err)
  static removeUser(username, callback){
    return Server.invoke()("removeUser", arguments);
  }
  //linuxUser.getUsers(callback)
  //callback function(err, usersInfo)
  static getUsers(callback){
    return Server.invoke()("getUsers", arguments);
  }
  //linuxUser.getUserInfo(username, callback)
  //username String
  //callback function(err, userInfo)
  static  getUserInfo(username, callback){
    return Server.invoke()("getUserInfo", arguments);
  }
  //linuxUser.setPassword(username, password, callback)
  //username String
  //password String
  //callback function(err)
  static setPassword(username, password, callback){
    return Server.invoke()("setPassword", arguments);
  }
  //linuxUser.addGroup(groupname, callback)
  //groupname String
  //callback function(err, groupInfo)
  static addGroup(groupname, callback){
    return Server.invoke()("addGroup", arguments);
  }
  //linuxUser.removeGroup(groupname, callback)
  //groupname String
  //callback function(err)
  static removeGroup(groupname, callback){
    return Server.invoke()("removeGroup", arguments);
  }
  //linuxUser.getGroups(callback)
  //callback function(err, groupsInfo)
  static getGroups(callback){
    return Server.invoke()("getGroups", arguments);
  }
  //linuxUser.getGroupInfo(groupname, callback)
  //groupname String
  //callback function(err, groupInfo)
  static getGroupInfo(groupname, callback){
    return Server.invoke()("getGroupInfo", arguments);
  }
  //linuxUser.addUserToGroup(username, groupname, callback)
  //username String
  //groupname String
  //callback function(err)
  static addUserToGroup(username, groupname, callback){
    return Server.invoke()("addUserToGroup", arguments);
  }
  
  static WindowsLogin(options, onresult, onerror){
	const { spawn } = System.getModule('child_process');
	var exe = '\\stack\\Next\\System\\Credentials\\Windows\\WindowsCredentials.exe';
	function run(cmd, args, onstdout, onstderr, onclose){
		let runtime = spawn(cmd, args),
		data = "", err = "";
		runtime.stdout.on('data', (stdout) => {
			data += stdout;
			if(onstdout) onstdout(stdout);
		});

		runtime.stderr.on('data', (stderr) => {
			err += stderr;
			if(onstderr) onstderr(stderr);
		});

		runtime.on('close', (code) => {
			if(onclose) onclose(code, data, err);
		});
	}
	run(exe, options, null, null, (exitCode, stdout, stderr) => {
		if(onresult) onresult(stdout, exitCode);
		if(onerror) onerror(stderr, exitCode);
	});
  }
  
  static authenticateWindows(user, password, onAuthorized, onError){
    var onError = onError ? onError : function(error){
      if(error) console.error(error);
      else console.error("Problem with user/password combination.");
    };
    var onAuthorized = onAuthorized ? onAuthorized : function(){
      console.log(user, 'has been authorized.');
    }
	Server.WindowsLogin(['stacknext.com', user, password], result => {
		try {
			let credentials = JSON.parse(result);
			if(credentials.authorized === true){
				onAuthorized();
			}
			else onError();
		} 
		catch(err){
			console.error(err);
			onError(err.stack);
		}
	});
  }

  static authenticate(user, password, onAuthorized, onError) {
    if(!user || !password) {
      console.error("User and password are required"); 
      return;
    }
    var onError = onError ? onError : function(error){
      if(error) console.error(error);
      else console.error("Problem with user/password combination.");
    };
    var onAuthorized = onAuthorized ? onAuthorized : function(){
      console.log(user, 'has been authorized.');
    }
    System.getModule('passwd-linux').checkUser(user, function (error0, response0) {
      if (error0) {
        onError(error0);
      } else {
        if(response0 == "userExist"){
          // if user exist 'response' will contain 'userExist' 
          System.getModule('passwd-linux').checkPass(user, password, function (error1, response1) {
            if (error1) {
              onError(error1);
            } else {
              // response: passwordCorrect or passwordIncorrect 
              if(response1 == "passwordCorrect") {
                onAuthorized();
              }
              else {
                onError('Password not correct.');
              }
            }
          });
        } else {
          onError('User does not exist.');
        }
      }
    });
  }
}




