class ansible_playbook_manager extends Endpoint {
  static get path(){
    return ["/v1/ansible_playbook/{action}","/v1/ansible_playbook/{name}/{action}"];
  }

  POST(){
    this.executeAction();
  }

  GET(){
    this.executeAction();
  }

  executeAction(){
    try {
      let urlParams = this.req.pathParam,
          origin = this.req.headers.origin;

      if(origin){
        this.res.setHeader('Access-Control-Allow-Origin', origin);
      }

      switch(urlParams.action){
        case "list":
          this.listAllTasks();
          break;
        case "add":
          this.add();
          break;
        case "update":
          this.update();
          break;
          case "updateTask":
          this.updatePlaybookTask();
          break;
        case "get":
          this.get();
          break;
        default:
          var msg = { error:true, message:"Action '"+urlParams.action+"' not defined." };
          this.res.json(msg);
          break;
      }
    }
    catch(e){
      console.log(e);
    }
  }
  
  updatePlaybookTask(){
    var task_id = this.getRequestParameter('task_id');
    let playbook_id = mongo.db.ObjectId(this.getRequestParameter('playbook_id'));
    mongo.db.collections.update('user_tasks', { _id:mongo.db.ObjectId(task_id) }, { $set: { "playbook_id": playbook_id } }, (err, result)=>{
      if(err) {
        this.res.json(err);
        return;
      }
      this.res.json(result);
    });
  }

  update(){
    var id = this.getRequestParameter('id');
    let playbook = JSON.parse(this.getRequestParameter('document'));
    mongo.db.collections.update('user_playbooks', { _id:mongo.db.ObjectId(id) }, { $set: { "playbook": playbook } }, (err, result)=>{
      if(err) {
        this.res.json(err);
        return;
      }
      this.res.json(result);
    });
  }

  get(){
    var id = this.getRequestParameter('id');
    mongo.db.collections.search('user_playbooks', { _id:mongo.db.ObjectId(id) }, (err, result)=>{
      if(err) {
        this.res.json(err);
        return;
      }
      if(result.length>0){
        this.res.json(result);
      }
      else {
        this.res.json({ message : "No record found." });
      }
    });
  }

  add(){
    let playbook = JSON.parse(this.getRequestParameter('document'));
    mongo.db.collections.insert('user_playbooks', { playbook: playbook } , (err, result) => {
      if(err){
        this.res.json({message:"User key cannot be added."});
        return; 
      }
      this.res.json({message:"User key has been added."});
    });   
  }

  listAllTasks(){
    mongo.db.collections.search('user_playbooks', {}, (err, result)=>{
      if(err) {
        this.res.json(err);
        return;
      }
      if(result.length>0){
        this.res.json(result);
      }
      else {
        this.res.json({ message : "No record found." });
      }
    });
  }



}



