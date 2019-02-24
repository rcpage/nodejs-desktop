class SessionManager {
  static run(req, res, next){
    req.session = {};
	if(next) next();
  }
}










