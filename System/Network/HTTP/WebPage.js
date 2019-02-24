using('System.Network.HTTP.Handle');

class WebPage extends Handle {

  
  get path(){
  	return WebPage.path;
  }
  
  ctor(req, res, html) {
    this.init(req, res, html);
  }
  
  onGet(){
  	this.httpResponse = this.dom.serialize();
  }
  
  render(){
  	this.handle();
  }
  
  init(req, res, html) {
    if(this._init == undefined) {
      this.req = req;
      this.res = res;
      this.res.setHeader('Content-Type', 'text/html');
      this.httpResponse = html;
      this._init = true;
    } else {
    	throw new Error(this.constructor.name + " has already been initialized.");
    }
  }

  getTemplate(){
    let template = global.instances[this.id];
    if(template != undefined && WebPage.preserveTemplateInstance === true) {
      return template;
    }
    else {
      let tmpl = new Template(this.html);
      template = Template.createInstance(tmpl.dom, this.id);
      return template;
    }
  }

  get id(){
    return this.req.sessionID + "@" + this.req.URL.pathname;
  }

  get dom(){
    let inst = this.getTemplate();
    if(inst) return inst.dom;
    else throw new Error('WebPage dom instance not defined.');
  }

  get window(){
    return this.dom.window;
  }

  get document(){
    return this.window.document;
  }
  
  dispose(){
  	super.dispose();
    delete this.html;
    delete this._init;
  }
}
//needed to enhance performance in exchange for more app memory
//set to false when developing html template so they get updated
//when changes are made to the disk.
WebPage.preserveTemplateInstance = true;











