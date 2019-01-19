global.System = require('./System.js');
global.instances = {};
global.currentWorkingDirectory = {};
//list of shell commands
global.shell  = {};
//list of running pids
global.pid = {};
global.stdout = {};
global.stderr = {};
using('System.V8');
using('System.Network.HTTP.LoadBalancer');

var loadbalancer = null;
const tls = System.getModule('tls');
const { constants } = System.getModule('crypto');
let myIP = '192.168.001.254';
let blacklist_ip = ['103.085.224.196'];

const DesktopExpertSSLPath = '/stack/ssl/www.desktop.expert/';
const defaultKey = System.readFile(DesktopExpertSSLPath + 'privkey.pem');
const defaultCrt = System.readFile(DesktopExpertSSLPath + 'fullchain.pem');

const DesktopExpertSSLPath2 = '/stack/ssl/desktop.expert/';
const defaultKey2 = System.readFile(DesktopExpertSSLPath2 + 'privkey.pem');
const defaultCrt2 = System.readFile(DesktopExpertSSLPath2 + 'cert.pem');

const EncryptExpertSSLPath = '/stack/ssl/encrypt.expert/';
const EncryptExpertKey = System.readFile(EncryptExpertSSLPath + 'privkey.pem');
const EncryptExpertCrt = System.readFile(EncryptExpertSSLPath + 'cert.pem');


const EmergeBusinessSSLPath = '/stack/ssl/www.emerge.business/';
const EmergeBusinessKey = System.readFile(EmergeBusinessSSLPath + 'privkey.pem');
const EmergeBusinessCrt = System.readFile(EmergeBusinessSSLPath + 'cert.pem');

const EmergeBusinessSSLPath2 = '/stack/ssl/emerge.business/';
const EmergeBusinessKey2 = System.readFile(EmergeBusinessSSLPath2 + 'privkey.pem');
const EmergeBusinessCrt2 = System.readFile(EmergeBusinessSSLPath2 + 'cert.pem');

const EmergeBusinessSSLPath3 = '/stack/ssl/emerge-business.com/';
const EmergeBusinessKey3 = System.readFile(EmergeBusinessSSLPath3 + 'privkey.pem');
const EmergeBusinessCrt3 = System.readFile(EmergeBusinessSSLPath3 + 'cert.pem');

const hosted_domains = [{
  https: tls.createSecureContext({
    key: EmergeBusinessKey,
    cert: EmergeBusinessCrt
  }),
  domain: "www.emerge.business",
  host: "http://localhost:8087"
}, {
  https: tls.createSecureContext({
    key: EmergeBusinessKey2,
    cert: EmergeBusinessCrt2
  }),
  domain: "emerge.business",
  host: "http://localhost:8087"
}, {
  https: tls.createSecureContext({
    key: defaultKey2,
    cert: defaultCrt2
  }),
  domain: "desktop.expert",
  host: "http://localhost:8083"
}, {
  https: tls.createSecureContext({
    key: defaultKey,
    cert: defaultCrt
  }),
  domain: "www.userdesktop.com",
  host: "http://localhost:8083"
}, {
  https: false,
  domain: "lg.userdesktop.com",
  host: "http://localhost:8082"
}, {
  https: false,
  domain: "sn1.userdesktop.com",
  host: "http://localhost:8084"
}, {
  https: tls.createSecureContext({
    key: EmergeBusinessKey3,
    cert: EmergeBusinessCrt3
  }),
  domain: "emerge-business.com",
  host: "http://localhost:8087"
},{ 
	https: false,
	domain: "userdesktop.com",
	host:"http://localhost:8083"
},{ 
	https: false,
	domain: "api.userdesktop.com",
	host:"http://localhost:8088"
},{ 
	https: false,
	domain: "stacknext.com",
	host:"http://fedora29:8091"
},{ 
	https: false,
	domain: "api.stacknext.com",
	host:"http://fedora29:8090"
}];

function getDomains(){
  let domains = [];
  for(var i in hosted_domains){
    domains.push(hosted_domains[i].domain);
  }
  return domains;
}

function getSecureContext(domain){
  for(var i in hosted_domains){
    if(hosted_domains[i].https && domain == hosted_domains[i].domain){
      return  hosted_domains[i].https;
    }
  }
}

function isDomainSecure(domain){
  for(var i in hosted_domains){
    if(domain == hosted_domains[i].domain){
      return  !(hosted_domains[i].https === undefined || 
                hosted_domains[i].https === null ||
                hosted_domains[i].https === false);
    }
  }
}

function getHost(domain){
  for(var i in hosted_domains){
    if(domain == hosted_domains[i].domain){
      return  hosted_domains[i].host;
    }
  }
}

let https = {
  //You currently have TLSv1 enabled.
  //This version of TLS is being phased out. This warning won't break your padlock, 
  //however if you run an eCommerce site, PCI requirements state that TLSv1 must be 
  //disabled by June 30, 2018.
  secureOptions: constants.SSL_OP_NO_TLSv1,
  rejectUnauthorized: false,
  handshakeTimeout: 2500,
  SNICallback: function (domain, cb) {
    let secuireContext = getSecureContext(domain);
    if (secuireContext) {
      if (cb) {

        cb(null, secuireContext);
      } else {
        // compatibility for older versions of node
        return secuireContext; 
      }
    } else {
      console.log(`https://${domain} has no keys/certificates.`);
    }
  },
  //browser will throw error when commented out.
  //key: defaultKey, 
  //cert: defaultCrt, 
};

loadbalancer = new LoadBalancer('/', [], https, undefined, blacklist_ip);


for(var i in hosted_domains){
  loadbalancer.add(hosted_domains[i].domain, hosted_domains[i].host);
}


loadbalancer.start();

let port = 80;
console.log('HTTP running on port ' + port + ".");

var httpRouter = V8.HTTP.createServer(function(req, res){

  if(blacklist_ip.indexOf(req.ip()) == -1){

    req.startTime = Date.now();
    let hostedDomains = getDomains(),
        domain = req.headers.host,
        isDomainHTTPS = isDomainSecure(domain),
        url = req.headers.host + req.url;

    if(hostedDomains.indexOf(domain) != -1) {
      console.log((new Date()).toString(), '-', req.ip() + ' GRANT http://' + req.headers.host + ':' + port + req.url);
      if(isDomainHTTPS){
        res.redirect("https://" + url);
      } 
      else {
        loadbalancer.proxy.web(req, res, { 
          target: getHost(domain),
          headers: { 
            'x-forwarded-timestamp': Date.now()
          } 
        });
      }
    }
    else {
      console.log((new Date()).toString(), '-', req.ip() + ' ERROR http://' + req.headers.host + ':' + port + req.url, 'not hosted.');
      res.status(HTTPStatusCode.InternalServerError).end();
    }
  } 
  else {
    console.log((new Date()).toString(), '-', req.ip() + ' DENIED http://' + req.headers.host + ':' + port + req.url);
    res.status(HTTPStatusCode.InternalServerError).end("Your IP " + req.ip() + " has been blocked.");
  }
}).listen(port);


