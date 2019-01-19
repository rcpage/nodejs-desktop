var IncomingMessage = System.getModule('http').IncomingMessage;
IncomingMessage.prototype.ip = function ip(){
  let proxy_ip = this.headers['x-forwarded-for'] ? this.connection.remoteAddress : undefined,
      client_ip =  this.headers['x-forwarded-for'] ? this.headers['x-forwarded-for'] : this.connection.remoteAddress;
  
  function formatIPAddress(ip){
    if(!ip) return "";
    let parts = [];
    //ipv4
    if(ip.indexOf('.') != -1) {
      ip = ip.substr(ip.lastIndexOf(':') + 1);
      //add padding
      parts = ip.split('.');
      for(var i in parts){
        parts[i] = ("000" + parts[i]).substr(-3);
      }
    }
    //return ipv4 parts or full ipv6
    return parts.join('.') || ip;
  }
  
  client_ip = formatIPAddress(client_ip);
  proxy_ip = formatIPAddress(proxy_ip);
  
  return proxy_ip ? client_ip + " [" + proxy_ip + "]" : client_ip;
  
}

IncomingMessage.prototype.isHTTPS = function isHTTPS(){
  return this.socket.encrypted || false;
}

IncomingMessage.prototype.getHTTPResponse = function getHTTPResponse(res){
  let httpResponse = null;

  return this;
}










