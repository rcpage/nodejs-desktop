class keys extends Microservice {
  static get path() {
    return ["/v1/keys/{action}", "/v1/keys/{name}/{action}"];
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
        id = this.req.post.id || this.req.query.id,
        name = decodeURI(urlParams.name || this.req.post.name || this.req.query.name),
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
        case "decryptKey":
          this.decryptKey(id);
          break;
        case "storeKey":
          this.storeKey(name, password);
          break;
        case "searchKeys":
          this.searchKeys(name);
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

  static storeKey(name, password) {
    let doc = {
      name: name,
      key: System.encrypt(password),
      user: this.req.session.user
    };
    mongo.db.collections.insert('user_keys', doc, (err, result) => {
      if (err) {
        this.res.json({ message: "User key cannot be added." });
        return;
      }
      this.res.json({ message: "User key has been added." });
    });
  }

  static searchKeys(host) {
    mongo.db.collections.search('user_keys', { name: host }, (err, result) => {
      if (err) {
        this.res.json(err);
        return;
      }
      if (result.length > 0) {
        this.res.json(result);
      }
      else {
        this.res.json({ message: "No record found." });
      }
    });
  }

  static decryptKey(id) {
    mongo.db.collections.search('user_keys', { _id: mongo.db.ObjectId(id) }, (err, result) => {
      if (err) {
        this.res.json(err);
        return;
      }
      if (result.length > 0) {
        var list = [];
        for (var i in result) {
          var key = result[i].key,
            name = result[i].name;
          list.push({ name: name, decryptedString: System.decrypt(key) });
        }
        this.res.json(list);
      }
      else {
        this.res.json({ message: "No record found." });
      }
    });
  }

}



