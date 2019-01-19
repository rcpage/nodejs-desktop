function FileExplorer(winId, path, list){
  $.get('/user?o=home-path', USER_HOME_PATH => {
    if(list){
      var $header = $('<div class="win-body-toolbar"></div>');
      $header.append('<button type="button" class="btn btn-xs btn-default win-btn-help" role="button" title="Help"><span class="glyphicon glyphicon-info-sign"></span>&nbsp; Help</button>');
      $header.append('<button type="button" class="btn btn-xs btn-default win-btn-preview" role="button" title="Preview"><span class="glyphicon glyphicon-eye-open"></span>&nbsp; Preview</button>');
      $header.append('<button type="button" class="btn btn-xs btn-default win-btn-layout" role="button" title="Layout"><span class="glyphicon glyphicon-object-align-top"></span>&nbsp; Layout</button>');
      $header.append('<button type="button" class="btn btn-xs btn-default win-btn-upload" role="button" title="Upload"><span class="glyphicon glyphicon-cloud-upload"></span>&nbsp; Upload</button>');
      $header.append('<button type="button" class="btn btn-xs btn-default win-btn-newfolder" role="button" title="Close"><span class="glyphicon glyphicon-folder-close"></span>&nbsp; New folder</button>');
      $header.append('<button type="button" class="btn btn-xs btn-default win-btn-open" role="button" title="Close"><span class="glyphicon glyphicon-open"></span>&nbsp; Open</button>');

      var $leftSidePanel = $('<div class="win-body-left-panel"></div>');
      $leftSidePanel.append('<div style="text-align: left;" class="btn btn-xs btn-default btn-block user-lib-recent"><span class="glyphicon glyphicon-check"></span>&nbsp; Recent</div>');
      $leftSidePanel.append('<div style="text-align: left;" class="btn btn-xs btn-default btn-block user-lib-home"><span class="glyphicon glyphicon-home"></span>&nbsp; Home</div>');
      $leftSidePanel.append('<div style="text-align: left;" class="btn btn-xs btn-default btn-block user-lib-desktop"><span class="glyphicon glyphicon-paperclip"></span>&nbsp; Desktop</div>');
      $leftSidePanel.append('<div style="text-align: left;" class="btn btn-xs btn-default btn-block user-lib-documents"><span class="glyphicon glyphicon-folder-open"></span>&nbsp; Documents</div>');
      $leftSidePanel.append('<div style="text-align: left;" class="btn btn-xs btn-default btn-block user-lib-downloads"><span class="glyphicon glyphicon-save"></span>&nbsp; Downloads</div>');
      $leftSidePanel.append('<div style="text-align: left;" class="btn btn-xs btn-default btn-block user-lib-music"><span class="glyphicon glyphicon-music"></span>&nbsp; Music</div>');
      $leftSidePanel.append('<div style="text-align: left;" class="btn btn-xs btn-default btn-block user-lib-pictures"><span class="glyphicon glyphicon-picture"></span>&nbsp; Pictures</div>');
      $leftSidePanel.append('<div style="text-align: left;" class="btn btn-xs btn-default btn-block user-lib-videos"><span class="glyphicon glyphicon-facetime-video"></span>&nbsp; Videos</div>');
      $leftSidePanel.append('<div style="text-align: left;" class="btn btn-xs btn-default btn-block user-lib-trash"><span class="glyphicon glyphicon-trash"></span>&nbsp; Trash</div>');
      $leftSidePanel.append('<div style="text-align: left;" class="btn btn-xs btn-default btn-block user-lib-storage"><span class="glyphicon glyphicon-hdd"></span>&nbsp; Storage</div>');
      $leftSidePanel.append('<div class="tree-panel-computer"></div>');

      //center panel is a directory datatable with folders and files.   
      var $centerPanel = BuildCenterPanel(winId, path, list);

      var $rightSidePanel = $('<div class="win-body-right-panel">&nbsp;</div>');

      var $footer = $('<div class="win-body-footer"></div>');
      $footer.append('<form name="upload" method="post" action="/upload" enctype="multipart/form-data">\
<input type="file" name="image" multiple="multiple" style="display:none;">\
<input type="hidden" name="dir" value="/node/upload/"/>\
</form>');

      $(winId)
        .attr('file-explorer', 'true')
        .find('div.win-body')
        .empty()
        .append($header)
        .append($centerPanel)
        .append($leftSidePanel)
        .append($rightSidePanel)
        .append($footer);

      var buttonRefresh = $(Id(winId)).find('.win-btn-refresh');
      var buttonUp = $(Id(winId)).find('.win-btn-up');
      var buttonSearch = $(Id(winId)).find('.win-btn-search');
      var buttonBack = $(Id(winId)).find('.win-btn-back');
      var buttonFwd = $(Id(winId)).find('.win-btn-fwd');
      var buttonPreview = $(Id(winId)).find('.win-btn-preview');
      var buttonLayout = $(Id(winId)).find('.win-btn-layout');
      var buttonUpload = $(Id(winId)).find('.win-btn-upload');
      var buttonNewFolder = $(Id(winId)).find('.win-btn-newfolder');
      var buttonOpen = $(Id(winId)).find('.win-btn-open');
      var buttonHelp = $(Id(winId)).find('.win-btn-help');

      //user library buttons
      var userLibraryButtons = $(Id(winId)).find('.user-lib-recent, .user-lib-home, .user-lib-desktop, .user-lib-documents, .user-lib-downloads, .user-lib-music, .user-lib-pictures, .user-lib-videos, .user-lib-trash, .user-lib-storage');
      userLibraryButtons.click(button_UserDirectory_Click);


      function button_UserDirectory_Click(e){
        console.log(this.textContent);
        var USER_LIB_PATH = USER_HOME_PATH;
        switch(this.textContent.trim().toLowerCase()){
          case "recent":

            break;
          case "home":

            break;
          case "desktop":
          case "documents":
          case "downloads":
          case "music":
          case "pictures":
          case "videos":
            USER_LIB_PATH += "/" + this.textContent.trim();
            break;
          case "trash":
            USER_LIB_PATH += "/.local/share/Trash/files";
            break;
          case "storage":
            USER_LIB_PATH = '/';
            break;
        }
        $(Id(winId)).find('input.path').val(USER_LIB_PATH);
        buttonRefresh.trigger($.Event('click'));
      }

      function buttonRefresh_Click(e) {
        resizeLoadingDialog(); 
        $(Id(winId))
          .find('input.path')
          .trigger($.extend($.Event('keydown'), { keyCode:13 }));
      };
      function buttonUp_Click(e){
        var curPath =  $(Id(winId)).find('input.path').val();
        var parentDir = curPath.substr(0, curPath.lastIndexOf('/'));
        parentDir = parentDir.length==0 ? "/" : parentDir;
        $(Id(winId)).find('input.path').val(parentDir);
        buttonRefresh_Click(e);
      };
      function buttonSearch_Click(e){
        var curPath =  $(Id(winId)).find('input.path').val();
        var pattern = $(Id(winId)).find('input.search').val();
        $.get('/user?o=search&path='+curPath+'&pattern='+pattern, result => {
          console.log(result);
          var searchList = [];
          var uniquePaths = [];
          for(var i in result){
            let resultPath = result[i].indexOf(':')!=-1 ? result[i].substr(0, result[i].indexOf(':')) : "";
            console.log(resultPath);
            if(!resultPath) continue;
            if(uniquePaths.indexOf(resultPath) == -1){
              searchList.push({ path:  resultPath, isFile: true, isDirectory: false });
              uniquePaths.push(resultPath);
            }
          }
          $(Id(winId)).find('.win-body-center-panel').replaceWith(BuildCenterPanel(winId, curPath, searchList));
        });
      }
      function buttonBack_Click(e){
        alert("back!");
      }
      function buttonFwd_Click(e){
        alert("fwd!");
      }
      function buttonPreview_Click(e){
        var width =$(Id(winId)).find('.win-body-right-panel').width();
        if(width > 0){
          $(Id(winId)).find('.win-body-right-panel').width(0);
        }
        else {
          $(Id(winId)).find('.win-body-right-panel').width(200);
        }

        $(Id(winId))[0].onResize();
      }
      function buttonLayout_Click(e){
        alert('layout!');
      }
      function buttonUpload_Click(e){
        $(Id(winId)).find('input[type=file][name=image]').trigger(e);
      }
      function buttonNewFolder_Click(e){
        var path = $(Id(winId)).find('input.path').val();
        var foldername = prompt("Please enter your name", "New Folder");
        if(foldername){
          var scrollTop = $(winId).find('.win-body-center-panel').scrollTop();
          var scrollLeft= $(winId).find('.win-body-center-panel').scrollLeft();
          var cmd = [{ cmd:"mkdir", path: path+"/"+foldername, id: winId, scrollTop: scrollTop, scrollLeft: scrollLeft}];
          AppWebSocket.send(JSON.stringify(cmd));
        }
      }
      function buttonOpen_Click(e){
        $(Id(winId)).find('.win-body-center-panel tr').filter(function(){
          return $(this).find('td.active').size() > 0;
        }).dblclick();
      }
      function buttonHelp_Click(e){
        alert('help!');
      }

      function resizeLoadingDialog(){
        var widthOffset =  $('.win-body-center-panel', Id(winId)).hasVScrollBar() ? 20 : 0;
        $('.loading-dialog', Id(winId)).show();
        $('.loading-dialog', Id(winId)).width($('.win-body-center-panel', Id(winId)).width()-widthOffset);
        $('.loading-dialog', Id(winId)).height($('.win-body-center-panel', Id(winId)).height());
      }

      function action_cut(){
        var paths = getActivePathsFromCenterPanel();
        //highlight active table rows
        replaceActiveRowClass('alert alert-warning');
        //add paths to global clipboard object
        Clipboard.cut.length = 0;//empty clipboard
        $.merge(Clipboard.cut, paths);
      }
      function action_copy(){
        var paths = getActivePathsFromCenterPanel();
        var scrollInfo = getScreenScrollPosition();
        var sure = confirm("Are you sure?");
        if(sure){
          //highlight active table rows
          replaceActiveRowClass('alert alert-info');
          //user paths to send copy commands
          for(var i in paths){
            var extIndex = paths[i].path.lastIndexOf('.');
            var copyName = paths[i].path.substr(0, extIndex) + "-copy" + paths[i].path.substr(extIndex);
            var cmd = [{ cmd:"copy", src: paths[i].path, to: copyName, id: winId, scrollTop: scrollInfo.top, scrollLeft: scrollInfo.left}];
            AppWebSocket.send(JSON.stringify(cmd));
          }
        }
      }
      function action_paste(){
        var sure = confirm("Are you sure?");
        if(sure){
          var scrollInfo = getScreenScrollPosition();
          $(Clipboard.cut).each(function(i){
            var userPath = getUserPath();
            var filename = this.path.substr(this.path.lastIndexOf('/'));
            var newPath = userPath.substr(-1)=="/" ? userPath + filename.substr(1) : userPath + filename;
            var cmd = [{ cmd:"move", oldpath: this.path.toString(), newpath: newPath, id: winId, scrollTop: scrollInfo.top, scrollLeft: scrollInfo.left  }];
            AppWebSocket.send(JSON.stringify(cmd));
          });
        }
      }
      function action_new(){
        var userFilename = prompt("File name:");
        if(userFilename){
          var filename = getUserPath() + "/" + userFilename;
          AppWebSocket.send(JSON.stringify([{
            cmd:"shell"
            , args:"touch " + filename
          }]));
          setTimeout(function(){
            buttonRefresh.trigger($.Event('click'));
          }, 1000);
        }
      }
      function action_delete(){
        var paths = getActivePathsFromCenterPanel();
        var pathsToDelete = [];
        for(var i in paths){
          pathsToDelete.push(paths[i].path);
        }
        var scrollInfo = getScreenScrollPosition();
        var sure = confirm("Delete files?\n" + pathsToDelete.join('\n'));
        if(sure){
          for(var i in paths){
            var cmd = null;
            if(paths[i].isDirectory){
              cmd = [{ 
                cmd:"rmdir"
                , path: paths[i].path
                , id: winId
                , scrollTop: scrollInfo.top
                , scrollLeft: scrollInfo.left 
              }];
            } else {
              cmd = [{ 
                cmd:"delete"
                , path: paths[i].path
                , id: winId
                , scrollTop: scrollInfo.top
                , scrollLeft: scrollInfo.left 
              }];
            }
            AppWebSocket.send(JSON.stringify(cmd));
          }
        }
      }
      function action_rename(){
        var scrollInfo = getScreenScrollPosition();
        $('.win-body-center-panel', Id(winId)).find('tr').filter(function(){
          return $(this).find('td').eq(0).hasClass('active');
        }).each(function(){
          var self = this;
          var name = $(this).find('td').eq(0).text();
          var userPath = getUserPath();
          var fullpath =  userPath+ "/" + name;
          var $input = $('<input type="text" value="'+name+'" style="" />')
          .keydown(function(e){
            if(e.keyCode==13){
              var newName = $(this).val();
              AppWebSocket.send(JSON.stringify([{
                cmd:"rename"
                , oldpath: fullpath
                , newpath: userPath + "/" + newName
                , id: winId
                , scrollTop: scrollInfo.top
                , scrollLeft: scrollInfo.left
              }]));
              //replace input element with new name
              $(self).find('td').eq(0).find('span').eq(1).html(newName);
            }
          });
          //replace text with input element
          $(self).find('td').eq(0).find('span').eq(1).html($input);
        });
      }
      function action_open(){
        $(winId).find('.win-btn-open').click();
      }
      function action_close(){
        $(winId).find('.win-btn-close').click();
      }
      function action_zip(){
        var sure = confirm('Zip: '+getUserPath());
        if(sure) {
          AppWebSocket.send(JSON.stringify([{cmd:'zip', path: getUserPath()}]));
        }
      }
      function action_unzip(){
        var filepaths = [];
        var scrollInfo = getScreenScrollPosition();
        $('.win-body-center-panel', Id(winId)).find('tr').filter(function(){
          return $(this).find('td').eq(0).hasClass('active');
        }).each(function(){
          var name = $(this).find('td').eq(0).text();
          var userPath = getUserPath();
          var fullpath =  userPath+ "/" + name;
          var ext = fullpath.substr(fullpath.lastIndexOf('.'));
          if(ext.toLowerCase() == '.zip'){
            filepaths.push(fullpath);
          }
        });
        var dest = getUserPath();
        var sure = confirm('Unzip '+filepaths.length+" files to '"+dest+"'?");
        if(sure) {
          for(var i in filepaths){
            AppWebSocket.send(JSON.stringify([{cmd:'unzip', path: filepaths[i], dest: dest}]));
          }
        }
      }
      function action_properties(){
        var cmds = [];
        $('.win-body-center-panel', Id(winId)).find('tr').filter(function(){
          return $(this).find('td').eq(0).hasClass('active');
        }).each(function(){
          var name = $(this).find('td').eq(0).text();
          var path = getUserPath() + "/" + name;
          cmds.push({
            cmd:"properties"
            , path: path
          });
        });
        AppWebSocket.send(JSON.stringify(cmds));
      }

      function action_download_file(){
        let list = getActivePathsFromCenterPanel();
        let sure = confirm('Are you sure you want to download '+list.length+' files?');
        if(sure){
          for(let i in list){
            if(!list[i].isDirectory){
              window.open('/download?file=' + list[i].path);
            }
          }
        }
      }

      function replaceActiveRowClass(className){
        $('.win-body-center-panel', Id(winId)).find('tr').filter(function(){
          return $(this).find('td').eq(0).hasClass('active');
        }).each(function(){
          $(this).find('td')
            .removeClass('active')
            .addClass(className);
        });
      }
      function getActivePathsFromCenterPanel(){
        var paths = [];
        $('.win-body-center-panel', Id(winId)).find('tr').filter(function(){
          return $(this).find('td').eq(0).hasClass('active');
        }).each(function(){
          var name = $(this).find('td').eq(0).text();
          var userPath = getUserPath();
          var fullpath =  userPath+ "/" + name;
          paths.push({ 
            path : fullpath
            , isDirectory : $(this).attr('file')!='true'
          });
        });
        return paths;
      }
      function getScreenScrollPosition(){
        var scrollTop = $(winId).find('.win-body-center-panel').scrollTop();
        var scrollLeft= $(winId).find('.win-body-center-panel').scrollLeft();	
        return { top: scrollTop, left: scrollLeft };
      }
      function getUserPath(){
        return $(Id(winId)).find('input.path').val();
      }

      function resizeLeftPanel(e, ui){
        var pWidth = $leftSidePanel.parent().width();
        var lWidth = $leftSidePanel.innerWidth();
        $(winId).find(".win-body-center-panel").css('padding-left', lWidth+'px');
      };
      function resizeRightPanel(e, ui){
        $rightSidePanel.css('right',0).css('left','');
        var pWidth = $rightSidePanel.parent().width();
        var rWidth = $rightSidePanel.width();
        $(winId).find(".win-body-center-panel").css('right', rWidth+'px');
      };


      buttonRefresh.click(buttonRefresh_Click);
      buttonUp.click(buttonUp_Click);
      buttonSearch.click(buttonSearch_Click);
      buttonBack.click(buttonBack_Click);
      buttonFwd.click(buttonFwd_Click);
      buttonPreview.click(buttonPreview_Click);
      buttonLayout.click(buttonLayout_Click);
      buttonUpload.click(buttonUpload_Click);
      buttonNewFolder.click(buttonNewFolder_Click);
      buttonOpen.click(buttonOpen_Click);
      buttonHelp.click(buttonHelp_Click);

      var origOnResize = $(winId)[0].onResize ? $(winId)[0].onResize : function(){ };
      //override window onResize method to include left/right panels
      $(winId)[0].onResize = function(){
        origOnResize();
        resizeLeftPanel();
        resizeRightPanel();
      }

      //init left/rght onResize methods
      $leftSidePanel[0].onResize = resizeLeftPanel;
      $rightSidePanel[0].onResize = resizeRightPanel;

      //register left/right panel resizable plugin
      $leftSidePanel.resizable({
        handles: 'e'
        , resize: resizeLeftPanel
      });
      //hide right-panel
      $rightSidePanel.resizable({
        handles: 'w'
        , resize: resizeRightPanel
      }).attr("style","width:0px;");

      //register treeview plugin
      $(winId).find('.tree-panel-computer')
      // listen for event
        .on('changed.jstree', function (e, data) {
        var i, j, r = [];
        for(i = 0, j = data.selected.length; i < j; i++) {
          console.log(data.instance.get_node(data.selected[i]));
          r.push(data.instance.get_node(data.selected[i]).id);
        }
        //console.log('Selected: ' + r.join(', '));
        if(r.length==1){
          var path = r[0];
          $(GetActiveWindow())
            .find('input.path')
            .val(path)
            .trigger($.extend(
            $.Event('keydown')
            , { keyCode:13 }
          ));
        }
      })
        .jstree({ 'core' : {
          'data': {
            'url' : '/fs?',
            'data' : function (node) {
              return { 'id' : node.id };
            }
          }
        } });

      //register context menu plugin
      $(winId).contextmenu({ 
        target: "#context-menu"
        , before: function(e, context) {
          // execute code before context menu if shown
          console.log($(e.target).closest('tr'));
        },
        onItem: function(context, e) {
          // execute on menu item selection
          var action = $(e.target).text();

          switch(action){
            case "Open":
              action_open();
              break;
            case "Close":
              action_close();
              break;
            case "Cut":
              action_cut();
              break;
            case "Copy":
              action_copy();
              break;
            case "Paste":
              action_paste();
              break;
            case "New":
              action_new();
              break;
            case "Delete":
              action_delete();
              break;
            case "Rename":
              action_rename();
              break;
            case "Unzip":
              action_unzip();
              break;
            case "Zip":
              action_zip();
              break;
            case "Properties":
              action_properties();
              break;
            case "Download File":
              action_download_file();
              break;
            default:
              alert(action + " has not been defined.");
              break;
          }
        }});

      //register drag-n-drop to upload files
      InitFileDrop(winId);

      //invoke onResize method to update gui
      $(winId)[0].onResize();
    }

  });
}
