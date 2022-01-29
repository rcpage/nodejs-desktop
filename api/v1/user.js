using('System.Network.HTTP.Microservice');
class user extends Microservice {
  static get path() {
    return ["/v1/user/{action}", "/v1/user/{host}/{action}"];
  }

  static POST() {
    this.executeAction();
  }

  static GET() {
    this.executeAction();
  }

  static executeAction() {
    try {
      let urlParams = this.req.pathParam,
        id = this.req.query.id,
        host = decodeURI(urlParams.host || this.req.post.host || this.req.query.host),
        email = this.req.post.email || this.req.query.email,
        password = this.req.post.password || this.req.query.password,
        redirect = this.req.post.redirect || this.req.query.redirect,
        origin = this.req.headers.origin;

      if (origin) {
        this.res.setHeader('Access-Control-Allow-Origin', origin);
        //this.res.setHeader("Access-Control-Allow-Credentials", "true");
        //this.res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
      }

      switch (urlParams.action) {
        case "auth":
          this.auth(email, password, redirect);
          break;
        case "add":
          this.add(email, password);
          break;
        case "find":
          this.find(email);
          break;
        case "delete":
          this.remove(id);
          break;
        case "detail":
          this.detail(id);
          break;
        case "login":
          this.loginForm();
          break;
        default:
          var msg = { error: true, message: "Action '" + urlParams.action + "' not defined." };
          this.res.json(msg);
          break;
      }
    }
    catch (e) {
      console.log(e);
    }
  }



  static auth(email, password, redirect) {
    var msg = { authenticated: false, message: "User cannot be authenticated." };
    mongo.db.collections.search('users', { email: email }, (err, result) => {
      if (err) {
        this.res.json(err);
        return;
      }
      if (result.length > 0) {
        var userPassword = result[0].password;
        var match = System.comparePassword(password, userPassword.hash, userPassword.salt);
        if (match) {
          msg.authenticated = true;
          msg.message = "User is authenticated.";
          if (redirect) {
            this.res.redirect(redirect);
          }
          else {
            //this.loginForm(msg);
            this.res.json(msg);
          }
        }
        else {
          //this.loginForm(msg);
          this.res.json(msg);
        }
      } else {
        msg.message = "No record found.";
        this.res.json(msg);
      }
    });
  }

  static add(email, password) {
    System.createPassword(password, (result) => {
      let doc = {
        password: result,
        email: email,
      };
      mongo.db.collections.insert('users', doc, (err, result) => {
        if (err) {
          this.res.json({ message: "User cannot be added." });
          return;
        }
        this.res.json({ message: "User has been added." });
      });
    });
  }



  static find(email) {
    mongo.db.collections.search('users', { email: email }, (err, result) => {
      if (err) {
        this.res.json(err);
        return;
      }
      if (result.length > 0) {
        let recordId = result[0]._id;
        this.res.json({ id: recordId });
      }
      else {
        this.res.json({ message: "No record found." });
      }
    });
  }

  static detail(id) {
    mongo.db.collections.search('users', { _id: mongo.db.ObjectId(id) }, (err, result) => {
      if (err) {
        this.res.json(err);
        return;
      }
      if (result.length > 0) {
        let record = result[0];
        this.res.json(record);
      }
      else {
        this.res.json({ message: "No record found." });
      }
    });
  }

  static remove(id) {
    mongo.db.collections.delete('users', { _id: mongo.db.ObjectId(id) }, (err, result) => {
      this.res.json({ err: err, result: result });
    });
  }
}









