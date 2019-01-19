function InitFileDrop(winId){
  var filename = '';
  var fileIds = [];
  $(Id(winId)).find('.win-body').filedrop({
    requestType: 'POST',
    fallback_id: (Id(winId)+' form[name=upload] input[type=file][name=image]'),   // an identifier of a standard file input element, becomes the target of "click" events on the dropzone
    url: function(){
      return '/filedrop?path='+$(Id(winId)).find('input.path').val()+'/'+filename;
    },  // upload handler, handles each file separately, can also be a function taking the file and returning a url
    paramname: 'userfile', // POST parameter name used on serverside to reference file, can also be a function taking the filename and returning the paramname
    withCredentials: false,// make a cross-origin request with cookies
    //data: { // send POST variables
    //  	dir : function(){
    //    	return $(Id(winId)).find('input.path').val();
    //    }
    //},
    //headers: {          // Send additional request headers
    //	'header': 'value'
    //},
    error: function(err, file) {
      console.log(err, file);
      switch(err) {
        case 'BrowserNotSupported':
          alert('browser does not support HTML5 drag and drop')
          break;
        case 'TooManyFiles':
          // user uploaded more than 'maxfiles'
          break;
        case 'FileTooLarge':
          // program encountered a file whose size is greater than 'maxfilesize'
          // FileTooLarge also has access to the file which was too large
          // use file.name to reference the filename of the culprit file
          break;
        case 'FileTypeNotAllowed':
          // The file type is not in the specified list 'allowedfiletypes'
          break;
        case 'FileExtensionNotAllowed':
          // The file extension is not in the specified list 'allowedfileextensions'
          break;
        default:
          break;
      }
    },
    allowedfiletypes: [/*'image/jpeg','image/png','image/gif'*/],   // filetypes allowed by Content-Type.  Empty array means no restrictions
    allowedfileextensions: [/*'.jpg','.jpeg','.png','.gif'*/], // file extensions allowed. Empty array means no restrictions
    maxfiles: 25,
    maxfilesize: 500,    // max file size in MBs
    dragOver: function() {
      // user dragging files over #dropzone

    },
    dragLeave: function() {
      // user dragging files out of #dropzone

    },
    docOver: function() {
      // user dragging files anywhere inside the browser document window

    },
    docLeave: function() {
      // user dragging files out of the browser document window
    },
    drop: function(e) {

      var fileHTML = function(progressId, filename){
        return '<div id="'+progressId+'" class="progress">'+
          '<div class="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: 0%; text-align: left;padding-left: 10px;">'+
          filename +
          '</div>'+
          '</div>';
      }
      $('#FileUpload').css({
        background: 'White'
        , border: 'solid 1px #eee'
        , position: 'absolute'
        , bottom: '0px'
        , right: '0px'
        , 'z-index': 2
        , padding: '5px'
      }).show().width(400).height(300);
      // user drops file
      // fetch FileList object
      var files = e.target.files || e.dataTransfer.files;
      console.log(files);
      for(var i=0;i<files.length; i++){
        var progressId = 'upload-'+newId();
        fileIds[files[i].name] = progressId;
        console.log(files[i].name);
        $('#FileUpload').append(fileHTML(progressId, files[i].name));
        Uploads[progressId] = (Id(progressId));
      }
    },
    uploadStarted: function(i, file, len){
      // a file began uploading
      // i = index => 0, 1, 2, 3, 4 etc
      // file is the actual file of the index
      // len = total files user dropped
      //console.log("file uploadStarted!", file, len);
    },
    uploadFinished: function(i, file, response, time) {
      // response is the data you got back from server in JSON format.
      //console.log("file uploadFinished!",i, file,response,time);
      var progressId = fileIds[file.name];
      $('#'+progressId).find('.progress-bar').addClass('progress-bar-success');
      setTimeout(function(){
        $('#'+progressId).fadeOut(2000).remove();
        if($('#FileUpload').children().size()==0) {
          $('#FileUpload').fadeOut();
        }
      }, 4000);
    },
    progressUpdated: function(i, file, progress) {
      // this function is used for large files and updates intermittently
      // progress is the integer value of file being uploaded percentage to completion
      console.log("file progressUpdated!",i, file, progress);
      var progressId = fileIds[file.name];
      $('#'+progressId).find('.progress-bar').css('width', progress+'%')
    },
    globalProgressUpdated: function(progress) {
      // progress for all the files uploaded on the current instance (percentage)
      // ex: $('#progress div').width(progress+"%");
      //console.log("file globalProgressUpdated!", progress);
    },
    speedUpdated: function(i, file, speed) {
      // speed in kb/s
      //console.log("file speedUpdated!",i, file, speed);
    },
    rename: function(name) {
      // name in string format
      // must return alternate name as string
      //console.log("file rename!", name);
    },
    beforeEach: function(file) {
      // file is a file object
      // return false to cancel upload
      //console.log("file beforeEach!", file);
      return true;
    },
    beforeSend: function(file, i, done) {
      // file is a file object
      // i is the file index
      // call done() to start the upload
      //console.log("file beforeSend!", file);
      filename = file.name;
      done();
    },
    afterAll: function() {
      // runs after all files have been uploaded or otherwise dealt with
      console.log("file afterAll!");
      if($('#FileUpload').children().size()==0) {
        $('#FileUpload').fadeOut();
      }
    }
  });
}
