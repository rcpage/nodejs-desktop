function Id(id) {
  return id.indexOf('#') == -1 ? '#' + id : id;
}
function SocketPostAsync(json, callback) {
  var cmd = JSON.stringify(json);
  cmd = Base64.encode(cmd);
  $.post('/socket', { do: cmd }, function (data) {
    var responseJSON = null;
    try {
      responseJSON = JSON.parse(data);
      if (callback) callback(responseJSON);
    }
    catch (e) {
      console.log("Error: " + e.message);
    }
  });
}
function GetStatInfo(name, statsObj) {
  var val = "";
  for (var n in statsObj) {
    if (n == name) {
      val = statsObj[n];
      break;
    }
  }
  return val;
}
function GetFileIcon(filename) {
  var classIcon = "ui-icon file ";
  var fileExt = filename.substr(filename.lastIndexOf('.'));
  var fileExtMap = [".pdf", ".as", ".c", ".iso", ".htm", ".html", ".xml", ".xsl", ".cf", ".cpp", ".cs", ".sql", ".xls", ".xlsx", ".h", ".crt", ".pem", ".cer", ".php", ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".ppt", ".pptx", ".rb", ".text", ".txt", ".md", ".log.htaccess", ".doc", ".docx", ".zip", ".gz", ".tar", ".rar", ".js", ".css", ".fla"]
  var index = $.inArray(fileExt, fileExtMap);
  if (index != -1) classIcon += fileExtMap[index].replace('.', 'file-');
  return classIcon;
}
function fileSizeInMegabytes(bytes) {
  return (bytes / 1048576.0).toFixed(3);
}
function fileSizeInKilobytes(bytes) {
  return (bytes / 1024.0).toFixed(3);
}
function filesize(bytes) {
  return fileSizeInMegabytes(bytes) == 0.000 ? fileSizeInKilobytes(bytes) + "KB" : fileSizeInMegabytes(bytes) + "MB";
}

function htmlEncode(value) {
  //create a in-memory div, set it's inner text(which jQuery automatically encodes)
  //then grab the encoded contents back out.  The div never exists on the page.
  return $('<div/>').text(value).html();
}
function htmlDecode(value) {
  return $('<div/>').html(value).text();
}

function getEditorModeByFileExt(fileExt) {
  var mode = "simple";
  switch (fileExt) {
    case "css":
      mode = "css";
      break;
    case "html":
      mode = "htmlmixed";
      break;
    case "js":
      mode = "javascript";
      break;
  }
  return mode;
}
function newFrameTab(id, title, desc, callback) {
  var $div = $('<span id="' + id + '" title="' + desc + '" class="FrameTab noselect btn btn-sm btn-default">' + title + '</span>');
  if (callback) $div.click(callback);
  $div.click(function () {
    var $win = $('#' + id.replace('tab-', ''));
    var state = $win.attr('win-state');
    if (state == 'active') {
      $win.find('.win-btn-minimize').click();
    }
    if (state == 'minimize') {
      $win.find('.win-btn-maximize').click();
    }

  });
  $('#FrameTabs').append($div);
}
function newId() {
  return Math.random().toString(36).substr(2, 9);
}
function GetActiveWindow() {
  var element = null;
  $('#Windows .window').each(function (i, elem) {
    if ($(elem).css('z-index') == 1) {
      element = elem;
      return false;
    }
  });
  return element;
}
function execute(winId, cmd, callback) {
  if (callback) callback(winId, cmd);
  else {
    var cmd = JSON.stringify([{ cmd: 'execute', path: cmd, id: winId }]);
    console.log(cmd);
    AppWebSocket.send(cmd);
  }
}

