class ContentType {
  
  static get(ext){
    if(!ext) return undefined;
  	ext = ext.replace('.','').toUpperCase();
    return ContentType[ext];
  }
  
  static get HTML(){
  	return 'text/html';
  }
  static get JS(){
  	return 'text/javascript';
  }
  static get CSS(){
  	return 'text/css';
  }
  static get PNG(){
  	return 'image/png';
  }
  static get JPG(){
  	return 'image/jpeg';
  }
  static get WAV(){
  	return 'audio/wav';
  }
  static get MP3(){
  	return 'audio/mpeg';
  }
  static get SVG(){
  	return 'image/svg+xml';
  }
  static get PDF(){
  	return 'application/pdf';
  }
  static get MSDOC(){
  	return 'application/msword';
  }
  static get JSON(){
  	return 'application/json';
  }
  static get ICO(){
  	return 'image/x-icon';
  }
  static get ZIP(){
  	return 'application/zip';
  }
}


