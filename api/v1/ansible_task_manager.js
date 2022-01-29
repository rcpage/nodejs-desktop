class ansible_task_manager extends Microservice {
  static get path() {
    return ["/v1/ansible_task/{action}", "/v1/ansible_task/{name}/{action}"];
  }

  POST() {
    this.executeAction();
  }

  GET() {
    this.executeAction();
  }

  executeAction() {
    try {
      let urlParams = this.req.pathParam,
        origin = this.req.headers.origin;

      if (origin) {
        this.res.setHeader('Access-Control-Allow-Origin', origin);
      }

      switch (urlParams.action) {
        case "list":
          this.listAllTasks();
          break;
        case "listNew":
          this.listNewTasks();
          break;
        case "add":
          this.add();
          break;
        case "update":
          this.update();
          break;
        case "copy":
          this.copy();
          break;
        case "get":
          this.get();
          break;
        case "delete":
          this.delete();
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

  update() {
    var id = this.getRequestParameter('id');
    let task = JSON.parse(this.getRequestParameter('document'));
    console.log(task);
    mongo.db.collections.update('user_tasks', { _id: mongo.db.ObjectId(id) }, { $set: { "task": task } }, (err, result) => {
      if (err) {
        this.res.json(err);
        return;
      }
      this.res.json(result);
    });
  }

  copy() {
    var id = this.getRequestParameter('id');
    mongo.db.collections.search('user_tasks', { _id: mongo.db.ObjectId(id) }, (err, result) => {
      if (err) {
        this.res.json(err);
        return;
      }
      if (result.length > 0) {
        for (var i in result) {
          var task = result[i].task;
          mongo.db.collections.insert('user_tasks', { task: task }, (err, copy_result) => {
            if (err) {
              this.res.json(err);
              return;
            }
            this.res.json(copy_result);
          });
        }
      }
      else {
        this.res.json({ message: "No record found." });
      }
    });
  }

  delete() {
    var id = this.getRequestParameter('id');
    mongo.db.collections.delete('user_tasks', { _id: mongo.db.ObjectId(id) }, (err, result) => {
      if (err) {
        this.res.json(err);
        return;
      }
      this.res.json(result);
    });
  }

  get() {
    var id = this.getRequestParameter('id');
    mongo.db.collections.search('user_tasks', { _id: mongo.db.ObjectId(id) }, (err, result) => {
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

  add() {
    let task = JSON.parse(this.getRequestParameter('document'));
    mongo.db.collections.insert('user_tasks', { task: task }, (err, result) => {
      if (err) {
        this.res.json({ message: "User key cannot be added." });
        return;
      }
      this.res.json({ message: "User key has been added." });
    });
  }

  listAllTasks() {
    mongo.db.collections.search('user_tasks', {}, (err, result) => {
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

  listNewTasks() {
    mongo.db.collections.search('user_tasks', { playbook_id: null }, (err, result) => {
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


}



