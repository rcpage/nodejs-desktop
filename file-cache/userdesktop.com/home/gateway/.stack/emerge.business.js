global.System = require('./System.js');
global.instances = {};
global.currentWorkingDirectory = {};
//list of shell commands
global.shell  = {};
//list of running pids
global.pid = {};

global.stack = __dirname;

global.stdout = {};
global.stderr = {};
using('Service.SecureServer');
using('Service.LDAP');
using('Service.Database');
using('Service.API');
using('Service.User');
using('Service.NavMenu');
using('HTML.Template');
using('Emerge.Business.WebPage.Home');
using('Emerge.Business.WebPage.Search');
using('Emerge.Business.WebPage.DomainSearch');
using('Emerge.Business.WebPage.MyBusiness');
using('Emerge.Business.WebPage.SignIn');
using('Emerge.Business.WebPage.Dashboard');
using('Emerge.Business.WebPage.WebTemplate');

var www = global.stack + '/Emerge/Business/www';

//set to true in production
WebPage.preserveTemplateInstance = false;

class EmergeBusinessService extends SecureServer {
  //make public
  //isSessionAuthorized(req){
  //  return true;
  //}
}
let services = [
  Home, 
  Search, 
  DomainSearch,
  MyBusinessSignUp, 
  SignIn, 
  Dashboard, 
  LDAP,
  User,
  API,
  WebTemplate,
  NavMenu,
  Database
];
var ebs = new EmergeBusinessService(www, services);
ebs.debug = false;
ebs.start(8087);






















































