using('System.Network.HTTP.Microservice');
class userui extends Microservice {
  static get path() {
    return ["/user", "/user/{action}"];
  }

  static GET() {
    let pathParam = this.req.pathParam;
    switch (pathParam.action) {
      case "logout":
        this.req.session.userIsAuthorized = false;
        this.res.redirect('/user');
        break;
      case "dashboard":
        this.loginAuthorized();
        break;
      default:
        if (this.req.session.userIsAuthorized) {
          this.res.redirect('/user/dashboard');
        }
        else {
          this.loginForm({ action: "/user" });
        }
        break;
    }

  }

  static POST() {
    let request = System.getModule('request');
    request.post({
      url: 'http://api.userdesktop.com/v1/user/auth',
      body: System.serialize({ email: this.req.post.email, password: this.req.post.password })
    }, (err, response, body) => {
      if (err) {
        this.loginForm(err);
        return;
      }
      var json = JSON.parse(body);
      if (json.authenticated) {
        this.req.session.userIsAuthorized = true;
        this.res.redirect('/user/dashboard');
        //this.loginAuthorized(json);
      } else {
        this.loginForm(json);
      }
    });
  }

  static loginForm(context) {
    try {
      var html = System.renderTemplate(global.stack + '/api/v1/templates/user-login.html', context);
      this.res.end(html);
    }
    catch (e) {
      console.log(e);
    }
  }

  static loginAuthorized(context) {
    try {
      if (this.req.session.userIsAuthorized) {
        var html = System.renderTemplate(global.stack + '/api/v1/templates/user-authorized.html', context);
        this.res.end(html);
      }
      else this.loginForm({ message: "You are not authorized. Please sign in." });
    }
    catch (e) {
      console.log(e);
    }
  }

}

