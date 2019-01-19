using('System.Network.HTTP.HTTPStatusCode');

var ServerResponse = System.getModule('http').ServerResponse;

ServerResponse.prototype.json = function json(){
  this.setHeader('Content-Type', 'application/json');
  this.end(ServerResponse.stringify.apply(null, arguments));
}

ServerResponse.prototype.redirect = function redirect(path){
  if(path && path.length > 0){
    this.status(HTTPStatusCode.Found).setHeader('Location', path);
  }
  this.end();
}

ServerResponse.prototype.status = function status(value, message){
  this.statusCode = value;
  if(message) this.statusMessage = message;
  return this;
}


//private method
ServerResponse.stringify = function stringify(value, replacer, spaces) {
  // v8 checks arguments.length for optimizing simple call
  // https://bugs.chromium.org/p/v8/issues/detail?id=4730
  return replacer || spaces
    ? JSON.stringify(value, replacer, spaces)
  : JSON.stringify(value);
}



