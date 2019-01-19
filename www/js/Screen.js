function Screen(options){
  var o 			= options 		? options 		: {},
      title 		= o.title 		? o.title 		: "&nbsp;",
      desc			= o.desc		? o.desc		: "",
      address 	= o.address 	? o.address 	: "",
      content 	= o.content 	? o.content 	: "",
      resizable 	= o.resize 		? o.resize 		: true,
      width 		= o.width 		? o.width 		: "600px",
      height 		= o.height 		? o.height 		: "400px",
      cb_onresize = o.onresize 	? o.onresize 	: null,
      cb_execute 	= o.execute 	? o.execute 	: null,
      cb_maximize = o.onmaximize 	? o.onmaximize 	: null,
      cb_minimize = o.onminimize 	? o.onminimize 	: null,
      cb_onopen   = o.onopen 		? o.onopen 		: null,
      cb_onclose  = o.onclose 		? o.onclose		: null,

      showSubHeader = o.subheader!=null ? o.subheader : true,

      winId = 'win-'+newId(),
      tabId = 'tab-'+winId,
      winTitle = "Next #" + NumberOfWindows;

  newFrameTab(tabId, title, desc, function(){
    $('#Windows').children().css('z-index', 0);
    $win.css('z-index', 1);
    $win.fadeIn();
    $win.attr('win-state','restored');
  });

  var sub_head_style = "";
  var sub_head_height = 58;
  if(!showSubHeader){
    sub_head_style = ' style="display:none;"';
    sub_head_height = 28;
  }

  var html = '<div id="'+winId+'" class="panel panel-primary window" style="z-index: 1; position:absolute; width:'+width+'; height:'+height+';">';
  html+= '	<div class="panel-heading win-handle noselect" style="padding: 5px 10px;">';
  html+= '		<div class="win-controls">';
  html+= '			<button type="button" class="btn btn-xs btn-default win-btn-close" role="button" title="Close">';
  html+= '				<span class="glyphicon glyphicon-remove"></span>';
  html+= '			</button>';
  html+= '			<button type="button" class="btn btn-xs btn-default win-btn-maximize" role="button" title="Maximize">';
  html+= '				<span class="glyphicon glyphicon-plus"></span>';
  html+= '			</button>';
  html+= '			<button type="button" class="btn btn-xs btn-default win-btn-minimize" role="button" title="Minimize">';
  html+= '				<span class="glyphicon glyphicon-minus"></span>';
  html+= '			</button>';
  html+= '		</div>';
  html+= '		<h3 class="panel-title">'+ title +'</h3>';
  html+= '	</div>';

  html+= '	<div class="panel-sub-heading"'+sub_head_style+'>';
  html+= '			<button type="button" class="btn btn-xs btn-default win-btn-search" role="button" title="Back">';
  html+= '				<span class="glyphicon glyphicon glyphicon-search"></span>';
  html+= '			</button>';	
  html+= '			<span style="float: right; margin-left: 5px;">';
  html+= '				<input class="search" type="text" />';
  html+= '			</span>';
   html+= '			<button type="button" class="btn btn-xs btn-default win-btn-refresh" role="button" title="Back">';
  html+= '				<span class="glyphicon glyphicon glyphicon-refresh"></span>';
  html+= '			</button>';	
  html+= '			<button type="button" class="btn btn-xs btn-default win-btn-back" role="button" title="Back">';
  html+= '				<span class="glyphicon glyphicon-chevron-left"></span>';
  html+= '			</button>';
  html+= '			<button type="button" class="btn btn-xs btn-default win-btn-fwd" role="button" title="Forward">';
  html+= '				<span class="glyphicon glyphicon-chevron-right"></span>';
  html+= '			</button>';
  html+= '			<button type="button" class="btn btn-xs btn-default win-btn-up" role="button" title="Forward">';
  html+= '				<span class="glyphicon glyphicon-arrow-up"></span>';
  html+= '			</button>';
  html+= '			<span class="textbox">';
  html+= '				<input class="path" type="text" list="pathlist-'+winId+'" />';
  html+= '				<datalist id="pathlist-'+winId+'">';
  html+= '					<option value="item 1" />';
  html+= '					<option value="item 2" />';
  html+= '					<option value="item 3" />';
  html+= '				</datalist>';
  html+= '			</span>';

  html+= '	</div>';
  html+= '	<div class="panel-body win-body">';
  html+= content;
  html+= '	</div>';
  html+= '<div class="modal fade bs-example-modal-sm" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel">\
      <div class="modal-dialog modal-sm">\
        <div class="modal-content">\
          <div style="padding: 20px;">\
            <img src="images/ajax-loader.gif"/> <span style="margin-left: 10px;">Processing...</span>\
          </div>\
        </div>\
      </div>\
    </div>';
  html+= '</div>';


  var $win = $(html),	evt = {};	
  $win[0].onResize 	= function(){ if(cb_onresize) cb_onresize	(evt,$win); };
  $win[0].onOpen 		= function(){ if(cb_onopen)   cb_onopen		(evt,$win); };
  $win[0].onExecute 	= function(){ if(cb_execute)  cb_execute	(evt,$win); };
  $win[0].onMaximize 	= function(){ if(cb_maximize) cb_maximize	(evt,$win);
                                     if(cb_onresize) cb_onresize	(evt,$win); };
  $win[0].onMinimize 	= function(){ if(cb_minimize) cb_minimize	(evt,$win);
                                     if(cb_onresize) cb_onresize	(evt,$win); };

  $win.find('.win-body').css('margin-top', sub_head_height);				
  $win.draggable({ handle: ".win-handle" });
  if(resizable){
    $win.resizable({resize: cb_onresize });
  }
  $win.find('.win-btn-close').click(function(e){
    $win.remove();
    $('#'+tabId).remove();
    if(cb_onclose) cb_onclose(e, $win);
  });

  $win.mousedown(function(e){
    $('#Windows').children().css('z-index', 0);
    $win.css('z-index', 1);
  });

  $win.find('.win-btn-maximize').click(function(e){
    //if($win[0].onMaximize) $win[0].onMaximize();
    var state = $win.attr('win-state');
    if(state == 'maximized'){
      $win.width($win.attr('resize-width'));
      $win.height($win.attr('resize-height'));
      $win.css({
        position: 'absolute'
        , top:  $win.attr('restore-top')+'px'
        , left: $win.attr('restore-left')+'px'
        , right: 'auto'
        , bottom: 'auto'
      });
      $win.attr('win-state','restored');
    }
    else if(state == 'minimize'){
      $win.fadeIn();
      $win.attr('win-state','restored');
    }
    else {

      $win.attr('resize-width', $win.width());
      $win.attr('resize-height', $win.height());
      $win.attr('restore-top', $win.offset().top);
      $win.attr('restore-left', $win.offset().left);
      $win.css({position: 'absolute', top:0,left:0,right:0,bottom:0});
      $win.attr('win-state','maximized');
      $win.width('auto');
      $win.height('auto');
    }
    if($win[0].onMaximize) $win[0].onMaximize();
  });
  $win.find('.win-btn-minimize').click(function(e){
    $win.fadeOut(function(){});
    $win.attr('win-state','minimize');
    if($win[0].onMinimize) $win[0].onMinimize();
  });


  //show window to user
  //$('#StartMenu').fadeOut();
  $('#Windows').append($win);

  $win.find('input.path')
    .val(address)
    .keydown(function(e){
    var code = e.keyCode || e.which;
    if(code == 13) { //Enter keycode
      var winId = Id($(this).closest('.window').attr('id'));
      execute(winId, this.value, cb_execute);
    }
  });

  NumberOfWindows ++;
  //net.system.window.array.push($win[0]);

  if($win[0].onOpen) $win[0].onOpen();

  setTimeout(() => {
    $win.find('.win-btn-maximize').trigger($.Event('click'));
  }, 10);
  
  return winId;
}




