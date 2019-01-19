global.System = require('./System.js');
global.instances = {};
global.currentWorkingDirectory = {};
//list of shell commands
global.shell  = {};
//list of running pids
global.pid = {};

global.stdout = {};
global.stderr = {};
using('Next.Service.Command.js');
using('Next.HTML.Template');
using('Next.Business.LaGloria.WebPage.Home');
using('Next.Business.LaGloria.WebPage.Book');
using('Next.Business.LaGloria.WebPage.Session');
using('Next.Business.LaGloria.WebPage.GoogleMap');
using('Next.Business.LaGloria.WebPage.Gallery');
using('Next.Business.LaGloria.WebPage.Contact');
using('Next.Business.LaGloria.WebPage.Calendar');
using('Next.Business.LaGloria.WebPage.Todo');
var www = '/stack/Next/Business/LaGloria/www';

//set to true in production
WebPage.preserveTemplateInstance = true;

class LaGloriaService extends Command {
  //make public
  //isSessionAuthorized(req){
  //  return true;
  //}
}
var test = new LaGloriaService(www, [Home, Book, Session, GoogleMap, Gallery, Contact, Calendar, Todo]);
test.start(8082);

//www.desktop.expert!







































