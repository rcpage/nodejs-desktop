using('System.Network.PublicServer');
class PrivateServer extends PublicServer {

  get Key(){
    return System.readFile('./key.pem');
  }

  get Cert(){
    return System.readFile('./cert.pem');
  }

  ctor(){
    this.protocol = 'https';
    let settings = {
      //You currently have TLSv1 enabled.
      //This version of TLS is being phased out. This warning won't break your padlock, 
      //however if you run an eCommerce site, PCI requirements state that TLSv1 must be 
      //disabled by June 30, 2018.
      secureOptions: global.crypto.SSL_OP_NO_TLSv1,
      rejectUnauthorized: false,
      handshakeTimeout: 2500,
      //
      //Server Name Identification Callback
      //
      SNICallback: this.serverNameIdCallbackHandle,
      //browser will throw error when commented out.
      key: this.Key, 
      cert: this.Cert, 
    };
    this.createServer(System.getModule(this.protocol), settings);
  }

  serverNameIdCallbackHandle(domain, cb){
    console.log('domain', domain);
    let secureContext = this.getSecureContext(domain);
    if (secureContext) {
      if (cb) {
        cb(null, secureContext);
      } else {
        // compatibility for older versions of node
        return secureContext; 
      }
    } else {
      console.log(`https://${domain} has no keys/certificates.`);
    }
  }

  getSecureContext(domain){
    let tls = System.getModule('tls');
    let signature = lookupSignatures(domain);
    return tls.createSecureContext(signature);
  }

  lookupSignatures(domain){
    return {
      key : this.Key,
      cert: this.Cert
    };
  }


}

