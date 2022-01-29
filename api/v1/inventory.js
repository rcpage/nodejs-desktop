using('System.Network.HTTP.Microservice');
class inventory extends Microservice {
  static get path() {
    return ["/v1/inventory", "/v1/inventory/{action}"];
  }

  POST() {
    this.executeAction();
  }

  GET() {
    this.executeAction();
  }

  executeAction() {
    try {

      let id = this.req.query.id,
        action = this.req.pathParam.action || this.req.query.action,
        host = this.req.post.host,
        username = this.req.post.username,
        password = this.req.post.password;

      this.res.setHeader('Access-Control-Allow-Origin', '*');

      switch (action) {
        case "search":
          this.search(null);
          break;
        case "view":
          this.view(id);
          break;
        case "add":
          this.add(host, username, password);
          break;
        default:
          var msg = { error: true, message: "Action '" + action + "' not defined." };
          this.res.json(msg);
          break;
      }
    }
    catch (e) {
      console.log(e);
    }
  }

  add(host, username, password) {
    let doc = {
      host: System.encrypt(host),
      username: System.encrypt(username),
      password: System.encrypt(password),
      user: this.req.session.user
    };
    mongo.db.collections.insert('inventory', doc, (err, result) => {
      if (err) {
        this.res.json({ message: "User key cannot be added." });
        return;
      }
      this.res.json({ message: "User key has been added." });
    });
  }

  search(user) {
    mongo.db.collections.search('inventory', { user: user }, (err, result) => {
      if (err) {
        this.res.json(err);
        return;
      }
      if (result.length > 0) {
        var list = [];
        for (var i in result) {
          list.push({
            id: result[i]._id,
            credential: System.decrypt(result[i].username) + "@" + System.decrypt(result[i].host)
          });
        }
        this.res.json(list);
      }
      else {
        this.res.json({ message: "No record found." });
      }
    });
  }

  view(id) {
    mongo.db.collections.search('inventory', { _id: mongo.db.ObjectId(id) }, (err, result) => {
      if (err) {
        this.res.json(err);
        return;
      }
      if (result.length > 0) {
        var list = [];
        for (var i in result) {
          list.push({
            host: System.decrypt(result[i].host),
            username: System.decrypt(result[i].username),
            password: System.decrypt(result[i].password)
          });
        }
        this.res.json(list);
      }
      else {
        this.res.json({ message: "No record found." });
      }
    });
  }

}







