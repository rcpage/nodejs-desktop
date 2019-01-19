class HTTPStatusCode {
  static get OK(){
    return 200;
  }
  
  static get Found(){
  	return 302;
  }
  
  static get NotAuthorized(){
  	return 401;
  }
  
  static get NotFound(){
    return 404;
  }
  
  static get Forbidden(){
    return 403;
  }
  
  static get PayloadTooLarge(){
  	return 413;
  }
  
  static get InternalServerError(){
    return 500;
  }
}









