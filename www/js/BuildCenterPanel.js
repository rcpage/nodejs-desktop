function BuildCenterPanel(winId, path, list) {
  
  function unmaskMode(statsMode){
    let mode = Object.create(null);
    mode.public = {
      execute : statsMode & 1 ? true : false,
      write 	: statsMode & 2 ? true: false,
      read 	: statsMode & 4 ? true : false
    };
    mode.group = {
      execute : statsMode & 10 ? true : false,
      write 	: statsMode & 20 ? true : false,
      read 	: statsMode & 40 ? true : false
    };
    mode.owner = {
      execute : statsMode & 100 ? true : false,
      write 	: statsMode & 200 ? true : false,
      read 	: statsMode & 400 ? true : false
    };
    return mode;
  }

  function modeClassToString(mode){
    if(!mode) return "";
    let str = "";
    str += mode.read ? "r" : "-";
    str += mode.write ? "w" : "-";
    str += mode.execute ? "x" : "-";
    return str;
  }

  function modeToString(mode){
   	if(!mode) return "";
    let str = modeClassToString(mode.owner);
    str += modeClassToString(mode.group);
    str += modeClassToString(mode.execute);
    return str;
  }
  
  console.log('files', list);
  
  var parentDir = path!="/" ? path.substr(0, path.lastIndexOf('/')) : path;
  list.unshift({ path:"..", isFile:false, isDirectory: true });
  var thead = '<thead><tr><th>Name</th><th align="right">Last Modified</th><th>Mode</th><th style="text-align:center;">Size</th></tr></thead>'
  var html = '<table class="table file-explorer">';
  html += thead;
  html += '<tbody>';
  for(var i in list){
    var classAttr = list[i].isFile ? 'class="'+GetFileIcon(list[i].path)+'"' : 'class="ui-icon folder"';
    html += '<tr file="'+list[i].isFile+'" style="cursor: pointer;">';
    html += '<td><span '+classAttr+' style="float: left; margin-right: .3em;"></span><span>'+list[i].path+'</span></td>';

    var mtime = GetStatInfo('mtime', list[i].stats);
    var mode = unmaskMode(GetStatInfo('mode', list[i].stats));
    var dateLastModified = new Date(mtime);
    var mmddyyy = mtime.length>0 ? ("00" + (dateLastModified.getMonth() + 1)).substr(-2) + '/' + ("00" + dateLastModified.getDate()).substr(-2) + '/' +  dateLastModified.getFullYear():"";
    html += '<td>'+mmddyyy+'</td>';
    var fileSize = list[i].isFile ? filesize(GetStatInfo('size', list[i].stats)):"";
    //html += '<td>'+(list[i].ContentType || "")+'</td>';
    html += '<td>' + modeToString(mode) + '</td>';
    html += '<td style="text-align:center;">'+fileSize+'</td>';
    html += '</tr>';
  }
  html += '</tbody>';
  html+='</table>';
  var div = '<div class="win-body-center-panel">';
  div += '<div class="loading-dialog" align="center" style="display:none;"><img src="images/ajax-loader.gif"/></div>';
  div += html;
  div += '</div>';
  $centerPanel = $(div);
  
  $centerPanel.find('tr')
    .dblclick(function(){
    
    var cmd = null;
    var isFile = $(this).attr('file') == 'true' ? true : false;
    path += path!='/' && path.length>0 && path.substr(-1)!='/' ? '/' : '';
    if(isFile){
      var txt = $(this).find('td').eq(0).text();
      var filename = path + txt;
      var ext = txt.substr(txt.lastIndexOf('.')).toLowerCase();
      var imgFileExts = ['.jpg','.jpeg','.png','.gif'];
      var browserHandleFileExt = ['.zip', '.pdf', '.exe'];
      if($.inArray(ext, imgFileExts)!=-1){
        ImageViewer(filename);
      }
      else if($.inArray(ext, browserHandleFileExt)!=-1){
        window.location.replace("/fs?action=download&id=" + filename);
      }
      else {
        cmd = JSON.stringify( [ { cmd: "read", path: path + txt } ] );
        console.log(cmd);
        AppWebSocket.send(cmd);
      }
    } else {
      
      ShowLoadingDialog(winId);
      
      if($(this).find('td').eq(0).text() == ".."){
        path = parentDir;
      } else {
        path += $(this).find('td').eq(0).text();

      }
      cmd = JSON.stringify([{ cmd: 'dir', path : path, id : winId }]);
      console.log(cmd);
      AppWebSocket.send(cmd);
      $(winId).find('input.path').val(path);
    }
  })
    .mousedown(function(e){
      switch (e.which) {
        case 1:
        case 3:
          //Left or Right Mouse button pressed
          if(!e.shiftKey) {
            $(this).parent().find('td').removeClass('active');
          }
          $(this).find('td').addClass('active');

          var rightPanel = $(Id(winId)).find('.win-body-right-panel');

          if(rightPanel.width() > 0){
            var filename = $(this).find('td').eq(0).text();
            var contentType = $(this).find('td').eq(2).text();
            var fullpath = path+"/"+filename;
            if(contentType!='folder')
            {
              SocketPostAsync([{cmd:'read', path: fullpath}], function(transaction){
                var str = transaction[0].response.data.string || "";

                rightPanel.children().filter(function(){ 
                  return !$(this).hasClass('ui-resizable-handle');
                }).remove();
                if(contentType.indexOf("image") != -1){
                  var src = "/fs?action=send&id="+fullpath;
                  rightPanel.prepend('<img src="'+src+'" />');
                } 
                else
                {
                  rightPanel.prepend('<pre>' + htmlEncode(str) + '</pre>');
                }
              });
            }
            else
            {
              rightPanel.children().filter(function(){ 
                return !$(this).hasClass('ui-resizable-handle');
              }).remove();
              rightPanel.prepend('<pre>Preview not available.</pre>');
            }
          } 
          break;
        case 2:
          alert('Middle Mouse button pressed.');
          break;
        default:
          alert('You have a strange Mouse!');
      }
  });

  //$centerPanel.contextmenu({ target: "#context-menu" });
  
  return $centerPanel;
}




