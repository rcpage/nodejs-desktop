function ScriptEditor(path, text, mode){
  var mode = mode ? mode : "simple";
  var editorId = "editor-"+newId();
  var textarea = '<textarea id="'+editorId+'" path="'+path+'">' + text + '</textarea>';
  var src = '';
  src += '<script>';
  src += '	Editors["'+editorId+'"] = CodeMirror.fromTextArea(document.getElementById("'+editorId+'"), {';
  src += '	  lineNumbers: true,';
  src += '	  mode: "'+mode+'",';
  src += '    matchTags: { bothTags: true },';
  src += '	  matchBrackets: true,';
  src += '	  foldGutter: true,';
  src += '	  styleActiveLine: true,';
  src += '	  extraKeys: { ';
  src += '		  "Ctrl-Space": "autocomplete"';
  src += '		, "Alt-F": "findPersistent"';
  src += '	  },';
  src += '	  gutters: ["CodeMirror-lint-markers", "CodeMirror-linenumbers", "CodeMirror-foldgutter"],';
  src += '	  lint: true';
  src += '	});';
  src += ' <\/script>';
  var menu = '';

  var header = '';
  //float right
  header+=('<button type="button" class="btn-toggle-function-list btn btn-xs btn-default win-btn-help" role="button" title="Close">Function List</button>');
  //float left
  header+=('<button type="button" class="btn-new btn btn-xs btn-default win-btn-organize" role="button" title="New">New</button>');
  header+=('<button type="button" class="btn-open btn btn-xs btn-default win-btn-organize" role="button" title="Open">Open</button>');
  header+=('<button type="button" class="btn-save btn btn-xs btn-default win-btn-organize" role="button" title="Save">Save</button>');
  header+=('<button type="button" class="btn-save-as btn btn-xs btn-default win-btn-organize" role="button" title="Save As...">Save As...</button>');
  header+=('<button type="button" class="btn-close btn btn-xs btn-default win-btn-newfolder" role="button" title="Close">Close</button>');
  header+=('<button type="button" class="btn-fold-code btn btn-xs btn-default win-btn-organize" role="button" title="Fold">Fold</button>');
  header+=('<button type="button" class="btn-unfold-code btn btn-xs btn-default win-btn-organize" role="button" title="Unfold">Unfold</button>');
  
  var winIcon = '<span class="glyphicon glyphicon-pencil" style="margin-right: 4px;"></span>';
  var functionList = '<div class="panel panel-default">\
    <div class="panel-heading">\
      <h3 class="panel-title">\
        <button class="btn-sort-fn-list" style="float:right">Sort</button> \
        <button class="btn-reload-fn-list" style="float:right; margin-right: 2px;">Reload</button> \
        Function List \
      </h3>\
    </div>\
    <div class="panel-body">\
    	<select class="function-list" multiple style="margin-top:40px; width: 100%; position: absolute; top: 0; bottom:0; right:0; left:0;"></select>\
    </div>\
  </div>';
  var filename = path.substr(path.lastIndexOf('/') + 1);
   var tabs = '\
	<ul class="nav nav-tabs" role="tablist">\
		<li role="presentation" class="active">\
          <a href="'+path+'">\
            <span class="ui-icon ui-icon-close" style="float: right;margin-top: 2px;cursor: pointer;"></span>\
            '+filename+'\
          </a>\
          <textarea style="display:none;">'+text+'</textarea>\
      	</li>\
	</ul>';
  var pathParts = path.split('/');
  var screenId = Id(NewScreen(winIcon + ' '+ pathParts[pathParts.length-1], { desc: path }));
  var win = AddPanelsToScreen(screenId);
      win.panels.menu.html(menu);
      win.panels.header.html(header);
      win.panels.center.html(textarea + src);
      win.panels.right.prepend(functionList);
      win.panels.left.prepend('<div class="tree-panel"></div>');
  var $win = win.window;
  
  function getCurrentPath(){
  	return $win.find('input.path').val();
  }
  function reloadFunctionList(){
    $win.find('.win-body-right-panel').width(300);
    var editor = Editors[editorId];
    var doc = editor.getDoc();
    var data="";
    doc.eachLine(function(line){data+=line.text;});
    var list = data.match(/function [$*|_*|a-z0-9]+[\s]*\([^\)]*\)(\.[^\)]*\))?/ig)
    $win.find('.function-list').empty();
    for(var i in list){
      $win.find('.function-list').append('<option>'+list[i].replace('function ','')+'</option>')
    }
    $win.find('.function-list').children().click(function(){
      var findstr = this.innerHTML;
      findstr = 'function ' + findstr.substr(0, findstr.indexOf('('));
      var lineNo = 0;
      var lineOffset = 0;
      doc.eachLine(function(line){
        if(line.text.indexOf(findstr)!=-1){
          //scroll to bottom to show function at first visible line
          editor.scrollTo(0, editor.getScrollInfo().height)
          editor.setCursor(lineNo - lineOffset);
          return;
        }
        lineNo++;
      });
    })
  }
  function toggleFunctionList(){
    var width = $win.find('.win-body-right-panel').width();
    if(width>0){
      $win.find('.win-body-right-panel').width(0);
    } 
    else {
      reloadFunctionList();
    }
    //trigger onresize event handler
    $win[0].onResize();
  }
  function sortFunctionList(){
    var selectList = $win.find('.function-list option')
    var vals=[];
    selectList.each(function(){vals.push(this.innerHTML);});
    vals = vals.sort(function (a, b) {
      return a.toLowerCase().localeCompare(b.toLowerCase());
    });
    selectList.each(function(i){this.innerHTML = vals[i];});
  }
  function newPage(){
    var currentPath = getCurrentPath();
    var newPath = currentPath.substr(0, currentPath.lastIndexOf('/'));
    ScriptEditor(newPath + "/Untitled.js", '');
  }
  function openFile(){
    var input = prompt('Please enter full filename.');
    if(input){
      AppWebSocket.send(JSON.stringify([{
        cmd: 'read'
        , path: input
      }]));
    }
  }
  function saveFunction(filepath){
    //var sure = confirm("Save file: "+filepath+"?");
    //if(sure){	
      var doc = Editors[editorId].getDoc();
      var data = "";
      doc.eachLine(function(line){
        data+=line.text+"\n";
      });
      var cmd = JSON.stringify([{cmd:"write", path:filepath, data:data}]);
      AppWebSocket.send(cmd);
   //}
  }
  function closeFunction(){
    var liTab = $(this).parent().parent();
    var prevTab = liTab.prev();
    liTab.remove();
    if(liTab.hasClass('active')){
      Editors[editorId].doc.setValue('');
      $(Id(editorId)).attr('path', '');       
    } 
    else {

    }
    prevTab.click();
    return false;
  }
  function isPathUnique(path){
    var tabs = [];
    $('.nav-tabs a').each(function(){
      tabs.push(this.href.replace(window.location.toString().substr(0, window.location.toString().lastIndexOf('/')),''));
    });
    return $.inArray(path, tabs)==-1;
  }
  function resizeTabs(){
    $win.find('.win-body-center-panel').css('top','72px');
    //$win.find('.win-body-center-panel').css('bottom','240px');
    $win.find('.win-body-tabs').css({
      'padding-left'  : $win.find('.win-body-left-panel').width()
      , 'padding-right' : $win.find('.win-body-right-panel').width()
    });
    //$win.find('.win-body-console').css({
    //	'padding-left'  : $win.find('.win-body-left-panel').width()
    // , 'padding-right' : $win.find('.win-body-right-panel').width()
    //});
  }
  function newTab(path){
      var filename = path.substr(path.lastIndexOf('/') + 1);
      return '<li role="presentation"><a href="'+path+'"><span class="ui-icon ui-icon-close" style="float: right;margin-top: 2px;cursor: pointer;"></span>'+filename+'</a><textarea style="display:none;"></textarea></li>';
    };
  function showTabContents(){
    try{

      var editor = Editors[editorId];

      var activeTabLink = $(this).parent().parent().find('li[class*=active] > a');

      //htmlEncode to keep browser from fetching scripts and rendering html
      var activeEditorContent = htmlEncode(editor.doc.getValue());

      //copy editor contents to previously selected tab
      activeTabLink.next().html(activeEditorContent);
      activeTabLink.next().attr('scrollTop', $win.find('.CodeMirror-vscrollbar').scrollTop());

      $(this).parent().parent().find('li').filter(function(){
        return $(this).attr('name') != 'menu';
      }).removeClass('active');

      $(this).parent().addClass('active');

      var textArea = $(this).next();
      var path = $(this).attr('href');
      var fileExt = path.substr(path.lastIndexOf('.') + 1);

      var editorValue = $.trim(htmlDecode(textArea.html()));

      if(editorValue.length > 0) {
        console.log("Reading local buffer...");
        $(Id(editorId)).attr('path', path);
        editor.doc.setValue(editorValue);
        editor.setOption('mode', getEditorModeByFileExt(fileExt));
        $win.find('.btn-reload-fn-list').click();
        $win.find('.CodeMirror-vscrollbar').scrollTop( $(this).next().attr('scrollTop'));
      } 
      else {
        console.log("Fetching remote buffer..."+path);
        var cmd = JSON.stringify([{ cmd : 'read', path : path }]);
        cmd = Base64.encode(cmd);
        $.post('/socket',{do:cmd},function(data){
          var json = JSON.parse(data);
          var value = (json[0].response.data.string);
          $(Id(editorId)).attr('path', path);
          $win.find('.CodeMirror-vscrollbar').scrollTop( $(this).next().attr('scrollTop'));
          editor.doc.setValue(value);
          editor.setOption('mode', getEditorModeByFileExt(fileExt));
          //htmlEncode to keep browser from fetching scripts and rendering html
          textArea.html(htmlEncode(value));
          $win.find('.btn-reload-fn-list').click();
          $win.find('.CodeMirror-vscrollbar').scrollTop( $(this).next().attr('scrollTop'));  
        });
      }
    }
    catch(error)
    {
      alert(error.message);
    }
    return false;
  }
  function foldScript(){
    foldAll(Editors[editorId]);  
  }
  function unfoldScript(){
    unfoldAll(Editors[editorId]);  
  }
  
  //right-side buttons
  $win.find('input.path').val(path);
  $win.find('.btn-toggle-function-list').click(toggleFunctionList);
  $win.find('.btn-reload-fn-list').click(reloadFunctionList);
  $win.find('.btn-sort-fn-list').click(sortFunctionList);
  
  $win.find('.btn-fold-code').click(foldScript);
  $win.find('.btn-unfold-code').click(unfoldScript);

  //Left Buttons
  $win.find('.btn-new').click(newPage);
  $win.find('.btn-open').click(openFile);
 
  $win.find('.btn-save').click(function(){
    var filepath = $(Id(editorId)).attr('path');
    saveFunction(filepath);
  });
  $win.find('.btn-save-as').click(function(){
    alert("save as!");
  });
  $win.find('.btn-close').click(function(){
    $win.find('.win-btn-close').click();
  });

  //show function list...
  //$win.find('.btn-toggle-function-list').click();


  
  $win.find('.win-body').append('<div class="win-body-tabs" style="background: #eee; width: 100%;height: 40px;"></div>')
 
  $win.find('.win-body-tabs').html(tabs);
  $win.find('.nav-tabs').sortable({axis: "x"});
  
  $win.find('.ui-icon-close').click(closeFunction);
  $win.find('.win-body-tabs a').click(showTabContents);

  

  $win.on('resize', resizeTabs);
  $win.find(".win-body-left-panel").on('resize', resizeTabs);
  $win.find(".win-body-right-panel").on('resize', resizeTabs);
  var root = path.substr(0, path.lastIndexOf('/'));
  $win.find('.tree-panel')
  // listen for event
    .on('changed.jstree', function (e, data) {
    var i, j, r = [];
    for(i = 0, j = data.selected.length; i < j; i++) {
      r.push(data.instance.get_node(data.selected[i]).id);
    }
    
    if(r.length==1 && isPathUnique(r[0])){
      var path = r[0];
      var tab = $(newTab(path));
      tab.find('a').click(showTabContents);
      tab.find('.ui-icon-close').click( closeFunction );
      $win.find('.nav-tabs')
        .append(tab)
        .sortable( "refresh" );
    }
  })
    .jstree({ 'core' : {
      'data': {
        'url' : '/fs?showFiles=true&root=' + root,
        'data' : function (node) {
          return { 'id' : node.id };
        }
      }
    }});

  $win.find('.win-body-left-panel').width(200);
  
  $win[0].onResize();
  resizeTabs();
 
  //randomly position screen in Q-II
  var posX = getRandomInt(100, window.innerWidth/2),
      posY = getRandomInt(100, window.innerHeight/2);
  $(Id(screenId)).css({
  	  left: posX
    , top: posY
  });
  
  return screenId;
}




