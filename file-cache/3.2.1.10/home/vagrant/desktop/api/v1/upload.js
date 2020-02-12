using('System.Text');
using('System.Network.HTTP.Handle');
using('System.Network.HTTP.HTTPStatusCode');

class Upload extends Handle  {


  static get temp(){
    if(this._temp == undefined){
      this._temp = {};
    }
    return this._temp;
  }

  static set temp(value){
    return this._temp = value;
  }

  static get path(){
    return "/upload";
  }
  
  createUploadDir(uploadPath){
    let err = null;
    //create upload path if does not exist
    if(!System.isDirectory(uploadPath)) {
      try{
        System.fs.mkdirSync(uploadPath);
      } 
      catch(error){
        this.res.status(HTTPStatusCode.InternalServerError);
        this.httpResponse = error.stack;
        err = error;
      }
    }
    return err;
  }

  onPost2(){
    var fileInfo = this.onGetFileInfo();
  	console.log('onPost', fileInfo);
    //this.async = true;
  }
  
  onPost() {
    var fileInfo = this.onGetFileInfo();
    for(var i in fileInfo){
      let payload = fileInfo[i].payload;
      let filename = fileInfo[i].header['Content-Disposition'].filename;
      let defaultUploadPath = global.rootDirectory + '/upload/';
      let uploadPath = this.req.headers['upload-path'] ? this.req.headers['upload-path'] : defaultUploadPath;
      //create upload path if does not exist
      let mkdirp = System.getModule('mkdirp');
      mkdirp.sync(uploadPath);
      //let err = this.createUploadDir(uploadPath);
      //if(err) {
      //  this.res.status(HTTPStatusCode.InternalServerError);
      //  this.httpResponse = err.stack;
      //  return;
      //}
      try {
        let resource = uploadPath + filename;
        //
        // Delete resource if exists
        //
        if (System.fs.existsSync(resource)) {
          System.fs.unlinkSync(resource);
        }
        //
        // write payload to resource
        //
        System.fs.writeFileSync(resource, payload);
      }
      catch(err){
      	this.res.status(HTTPStatusCode.InternalServerError);
        this.httpResponse = err.stack;
      }
    }//end for loop
    //this.redirect = Upload.path;
  }

  deleteTempFiles(headerFilename, size) {
    for(var j=0;j< size; j++){
      var readFile = Upload.temp[headerFilename][j];
      try {
        System.fs.unlinkSync(readFile);
        delete Upload.temp[headerFilename][j];
      }
      catch(err)
      {
        console.error(err);
      }
    }
  }

  onGet(){
    this.res.setHeader('Content-Type', 'text/html');
    this.httpResponse = '<!DOCTYPE html><html><body><form action="/upload" method="post" enctype="multipart/form-data">\
<input type="file" name="file" multiple><br>\
<input type="submit">\
</form></body></html>';
  }

  onGetFileInfo(){
    var fileInfo = [];
    let contentType = this.req.headers['content-type'];
    var params = this.getParams(contentType);
    //convert binary payload to hex to preserve data while converting to/from string/buffer
    var payload = this.req.payload;
    let files = Text.toHexString(payload).split(Text.toHexString(params.boundary));
    //cleanup array
    files = files.filter(file => { return Text.trim(file, Text.toHexString("\r\n")) != Text.toHexString("--"); });
    //did not want to use trim function to clean data
    //as it may introduce issues when dealing with plain text
    //files ending with new lines. want to preserve original payload
    files.forEach(item => {
      //remove "\r\n" and "\r\n--" from item
      let start = item.indexOf(Text.toHexString("\r\n")) + Text.toHexString("\r\n").length;
      let len = item.lastIndexOf(Text.toHexString("\r\n--")) - start;
      let cleanedItem = item.substr(start, len);
      let headerEndIndex = cleanedItem.indexOf(Text.toHexString("\r\n\r\n"));
      let bodyBeginIndex = headerEndIndex + Text.toHexString("\r\n\r\n").length;
      let headerString = cleanedItem.substr(0, headerEndIndex);
      let body = cleanedItem.substr(bodyBeginIndex);
      //convert from hex to utf8 string
      headerString = Buffer.from(headerString, 'hex').toString();
      //console.log(headerString);
      //convert from hex to binary buffer
      body = Buffer.from(body, 'hex');
      //parse header data parameters
      let header = {};
      headerString.split('\r\n').forEach(item => {
        let valuePair = item.split(':');
        header[valuePair[0]] = valuePair[1] ? this.getParams(valuePair[1].trim()) : undefined;
      });
      fileInfo.push({ 
        header: header, 
        payload: body
      });
    });
    return fileInfo;
  }

  getParams(lineItem){
    var params = {};
    if(lineItem == undefined) return params;
    if(lineItem.indexOf(';') == -1) return lineItem;
    lineItem.split(';').forEach(item => {
      let pair = item.trim().split('=');
      params[pair[0]] = decodeURIComponent(decodeURI(this.removeDblQuotes(pair[1])));
    });
    return params;
  }

  removeDblQuotes(str){
    if(str == undefined || str.indexOf('"') == -1) return str;
    let start = str.indexOf('"') + 1;
    return str.substr(start, str.lastIndexOf('"') - start)
  }
}





















