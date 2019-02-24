using('System.Network.HTTP.SessionManager');

class MongoDBSession extends SessionManager {

  static get secret(){
   	return "secret"; 
  }

  static run(req, res, next){
	this.exe(req, res, next);
  }

  static get dbUri(){
    if(this._dbUri == undefined){
      this._dbUri = "mongodb://localhost:27017/test";
    }
    return this._dbUri;
  }

  static get dbCollectionName(){
    if(this._dbCollectionName == undefined){
      this._dbCollectionName = "sessions";
    }
    return this._dbCollectionName;
  }

  static get expressSession(){
    if(this._exrpessSession == undefined){
      this._expressSession = System.getModule('express-session');
    }
    return this._expressSession;
  }

  static get MongoDBStore(){
    if(this._MongoDBStore == undefined){
      this._MongoDBStore =  System.getModule('connect-mongodb-session')(this.expressSession);
    }
    return this._MongoDBStore;
  }


  static get MongoDBSessionStore(){
    if(this._MongoDBSessionStore == undefined)
    {
      this._MongoDBSessionStore = new this.MongoDBStore({
        uri: this.dbUri,
        collection: this.dbCollectionName
      });
    }
    return this._MongoDBSessionStore;
  }

  static exe(req, res, next, secure){

    var session = {
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365, // 24 hours * 365 days
        secure: secure
      },
      store: this.MongoDBSessionStore,
      secret : this.secret,
      resave: false,
      saveUninitialized: true
    };

    //if(secure) session.cookie.secure = true;

    return this.expressSession(session)(req, res, next);
  }
}
