class Text {
  
  static toHexString(src){
    return Buffer.from(src).toString('hex');
  }
  
  static trim(str, char){
  	return this.trimRight(this.trimLeft(str, char), char);
  }

  static trimLeft(str, char) {  
    char = char ? char : ' '; 
    return str.replace(new RegExp('^' + char + '+'), "");
  }

  static trimRight(str, char) { 
    char = char ? char : ' '; 
    return str.replace(new RegExp(char + '+$'), "");
  } 
  
  static escapeHtml(unsafe) {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}

