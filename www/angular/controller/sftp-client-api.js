function mkdir(id, path, cb){
  HttpPost('http://'+API_HOSTNAME+'/v1/ssh2/mkdir','id='+id+'&path='+path, res => { 
    if(cb) cb(res);
  });
}

function rmdir(id, path, cb){
  HttpPost('http://'+API_HOSTNAME+'/v1/ssh2/rmdir','id='+id+'&path='+path, res => { 
    if(cb) cb(res);
  });
}

function lstat(id, path, cb){
  HttpPost('http://'+API_HOSTNAME+'/v1/ssh2/lstat','id='+id+'&path='+path, res => { 
    if(cb) cb(res);
  });
}

function stat(id, path, cb){
  HttpPost('http://'+API_HOSTNAME+'/v1/ssh2/stat','id='+id+'&path='+path, res => { 
    if(cb) cb(res);
  });
}

function unlink(id, path, cb){
  HttpPost('http://'+API_HOSTNAME+'/v1/ssh2/unlink','id='+id+'&path='+path, res => { 
    if(cb) cb(res);
  });
}

function rename(id, path, newPath, cb){
  HttpPost('http://'+API_HOSTNAME+'/v1/ssh2/rename','id='+id+'&path='+path+'&newPath='+newPath, res => { 
    if(cb) cb(res);
  });
}

function touch_file(id, path, cb){
  shell(id, 'touch '+path, cb);
}

function shell(id, cmd, cb){
  HttpPost('http://'+API_HOSTNAME+'/v1/ssh2/shell', 'id=' + id + '&command=' + cmd, (res)=>{ 
    if(cb) cb(res);
  });
}

function readdir(id, path, cb){
  let url = 'http://'+API_HOSTNAME+'/v1/ssh2/readdir';
  HttpPost(url,'id='+ id + '&path=' + path, res=>{
    if(cb) cb(res);
  });
}