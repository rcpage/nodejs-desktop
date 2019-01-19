function CommandProcessor(){
  var ws = {
    send: function(text){
      var encodedText=Base64.encode(text);
      $.post('http://api.rusty.com/socket',{do:encodedText}, function(json){
        ProcessData({do:text, data:json});
      });
    }
  };
  return ws;
}
function ProcessData (event) {
  try {
    if((typeof event.data) == "object"){
      var jsonList = event.data;
      for(var i in jsonList)
      {
        var jsonObj = jsonList[i];
        if(jsonObj.Exception){
          var attempts = 0;
          var loginAction = function(){
            window.loginEventData = event;
            $('#login-modal').modal('show');
          }
          loginAction();
        }
      }
      return;
    }

    var json = null;
    try{
      event.data = unescape(encodeURIComponent(event.data));
      json = JSON.parse(event.data);
    }
    catch(jsonError){
      console.error(event, jsonError);
      return;
    }



    for(var i in json){
      var result = json[i];
      if(result.response){
        if(result.response.error){
          if(result.response.error == "true"){
            //console.log(result.response.message);
            ProcessError(result);
          } 
          else {
            if(result.request && result.request.cmd) {
              //client ui depends on response data type
              //response type is determined by request cmd.
              //console.log(result.response.data);
              ProcessResult(result);
            }
          }
        }
      } else {

      }
    }
  } catch(e){
    console.log(e, event);
  }
}
function ProcessError(result){
  switch(result.request.cmd){
    case "write":
      alert(result.response.message);
      break;
    case "dir":

      break;
    case "os":

      break;
    case "execute":

      break;
    default:

      break;
  }
  var winId = result.request.id;
  //$(winId).find('div.win-body').html(result.response.message);
}
function ProcessResult(result){
  switch(result.request.cmd){
    case "dir":
      cmd_dir(result);
      break;
    case "os":
      cmd_os(result);
      break;
    case "execute":
      cmd_execute(result);
      break;
    case "read":
      cmd_read(result);
      break;
    case "rename":

      break;
    case "properties":
      cmd_properties(result);
      break;
    default:
      default_reload_dir(result);
      break;
  }
}
function cmd_dir(result){
  var winId = result.request.id;
  var list = result.response.data.array;
  var path = result.request.path ? result.request.path: "/";
  var $win = $(Id(winId));
  var hasFileExplorer = $win.attr('file-explorer')=="true";
  if(hasFileExplorer){
    var $leftPanel = $win.find('div.win-body-left-panel');
    var $centerPanel = $win.find('div.win-body-center-panel');
    var $rightPanel = $win.find('div.win-body-right-panel');

    //update file directory
    $centerPanel.replaceWith(BuildCenterPanel(winId, path, list));

    $win[0].onResize();

    //DD(winId);
    //console.log($leftPanel,$centerPanel,$rightPanel);

  }
  else {
    //Create FileExplorer Object in Window
    FileExplorer(winId, path, list);
  }
}
function cmd_read(result){
  var html = htmlEncode(result.response.data.string);
  console.log(result);
  if(result.request.id){
    $(Id(result.request.id)).find('.editor').html(html);
  } else {
    var fileExt = result.request.path.substr(result.request.path.lastIndexOf('.') + 1);
    var mode = getEditorModeByFileExt(fileExt);
    ScriptEditor(result.request.path, html, mode);
  }
}
function default_reload_dir(result){
  var msg = result.response.data.string;
  console.log(msg,result.request.scrollTop,result.request.scrollLeft);
  if(result.request.id){
    $(Id(result.request.id))
      .find('input.path')
      .trigger($.extend(
      $.Event('keydown')
      , { keyCode:13 }
    ));
    setTimeout(function(){
      $(Id(result.request.id)).find('.win-body-center-panel').scrollTop(result.request.scrollTop);
      $(Id(result.request.id)).find('.win-body-center-panel').scrollLeft(result.request.scrollLeft);
    }
               ,500);
  }
}
function cmd_execute(result){
  var winId = result.request.id;
  $(winId).find('div.win-body').html(
    JSON.stringify(result.response.data)
  );
}
function cmd_os(result){
  var res = result;
  var jsonString = JSON.stringify(result.response.data);
  $.get('tabs.html', function(html) {
    console.log(res);
    var cpuCount = res.response.data.cpus.length;
    var model = res.response.data.cpus[0].model;
    var speed = res.response.data.cpus[0].speed;
    var publicIP = res.response.data.networkInterfaces.lo[1].address;
    var localIP = res.response.data.networkInterfaces.eth0[0].address;

    html = html.replace('${CPU}', cpuCount+" x "+ model+" @"+speed +"GHz");
    html = html.replace('${MEMORY}', res.response.data.totalmem);
    html = html.replace('${PRIVATE_IP}', localIP);
    html = html.replace('${PUBLIC_IP}', publicIP);
    if(res.request.id){
      $(Id(res.request.id)).find('div.win-body').html(html);
    } else {
      var screenId = NewScreen('<span class="el el-laptop" style="margin-right: 4px;"></span>System');
      var result = AddPanelsToScreen(screenId);
      result.panels.left.width(250).append('<div class="device-tree"></div>');
      $(Id(screenId)).find('.device-tree')
        .on('changed.jstree', function (e, data) {
        var i, j, r = [];
        for(i = 0, j = data.selected.length; i < j; i++) {
          var node = data.instance.get_node(data.selected[i]);
          r.push(node.id);
        }
        if(r.length==1){
          var node_id = r[0];
          switch(node_id){
            case "Disk drives":
              $.getJSON('/disk',function(json){
                var ul = $('<ul class="list-group" style="margin: 5px;"></ul>');
                for(var i in json){
                  var desc = '<h2>Drive: ' + json[i].drive + ', Mount: '+json[i].mountpoint+'</h2>' +
                      '<div class="progress">\
<div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="'+json[i].usedPer+'" aria-valuemin="0" aria-valuemax="100" style="width: '+json[i].usedPer+'%">\
<span class="sr-only">'+json[i].usedPer+'% Complete (success)</span>\
</div>\
</div>'+
  ' Used '+json[i].used+' of '+json[i].total;
                  ul.append('<li class="list-group-item">'+desc+'</li>');
                }
                result.panels.center.html(ul);
                $(Id(screenId))[0].onResize();
              });
              break;
            case "Network adapters":
              $.getJSON('/network',function(json){
                var ul = $('<ul class="list-group" style="margin: 5px;"></ul>');
                for(var i in json){
                  var desc = '<h2>'+i+'</h2>';
                  var ipList = json[i];
                  for(var no in ipList){
                    desc += ipList[no].address + ', ' + ipList[no].family + '<br/>';
                  }
                  ul.append('<li class="list-group-item">'+desc+'</li>');
                }
                result.panels.center.html(ul);
                $(Id(screenId))[0].onResize();
              });
              break;
            case "Processors":
              $.getJSON('/cpu',function(json){
                console.log(json);
              });
              break;
            default:
              console.log(node_id+" not defined.");
              break;
          }
          //$.get('/disk');
        }
      })
        .jstree({ 'core' : {
          'data': {
            'url' : '/system?',
            'data' : function (node) {
              return { 'id' : node.id };
            }
          }
        }});
      var accordionHTML = '';
      result.panels.center.html(accordionHTML);

      result.panels.center.find('.accordion').accordion({
        collapsible: true,
        heightStyle: "fill",
        activate: function( event, ui ) {
          //Disk drives
          if($(ui.newPanel[0]).hasClass('disk-drives')){
            $.getJSON('/disk', function(json){
              var ul = $('<ul class="list-group" style="margin: 5px;"></ul>');
              for(var i in json){
                var desc = '<h2>Drive: ' + json[i].drive + ', Mount: '+json[i].mountpoint+'</h2>' +
                    '<div class="progress">\
<div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="'+json[i].usedPer+'" aria-valuemin="0" aria-valuemax="100" style="width: '+json[i].usedPer+'%">\
<span class="sr-only">'+json[i].usedPer+'% Complete (success)</span>\
</div>\
</div>'+
  ' Used '+json[i].used+' of '+json[i].total;
                ul.append('<li class="list-group-item">'+desc+'</li>');
              }
              $(Id(screenId))[0].onResize();
              $(ui.newPanel[0]).html(ul);
              result.panels.center.find('.accordion').accordion( "refresh" );
            });
          }
          //Network adapters
          if($(ui.newPanel[0]).hasClass('network-adapters')){
            $.getJSON('/network', function(json){
              var ul = $('<ul class="list-group" style="margin: 5px;"></ul>');
              for(var i in json){
                var desc = '<h2>'+i+'</h2>';
                var ipList = json[i];
                for(var no in ipList){
                  desc += ipList[no].address + ', ' + ipList[no].family + '<br/>';
                }
                ul.append('<li class="list-group-item">'+desc+'</li>');
              }

              $(Id(screenId))[0].onResize();
              $(ui.newPanel[0]).html(ul);
              result.panels.center.find('.accordion').accordion( "refresh" );
            });
          }
          //Processors
          if($(ui.newPanel[0]).hasClass('processors')){
            $.getJSON('/cpu', function(json){
              $(ui.newPanel[0]).html(JSON.stringify(json));
            });
          }
        }
      });
      $(Id(screenId))[0].onResize();
      //randomly position screen in Q-II
      var posX = getRandomInt(100, window.innerWidth/2),
          posY = getRandomInt(100, window.innerHeight/2);
      $(Id(screenId)).css({
        left: posX
        , top: posY
      });
    }
  });
}
function cmd_properties(result){
  var path = result.request.path;
  var props = result.response.data;
  console.log(path,props,result);
  InvokeProperties(path, props);

}








