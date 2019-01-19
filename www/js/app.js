var SystemCalendar = null;
var Editors = [];
var Uploads = [];
var NumberOfWindows = 0;
var AppWebSocket = null;
var Clipboard = {
	cut:[]
	,copy:[]
};

(function($) {
    $.fn.hasVScrollBar = function() {
        return this.get(0).scrollHeight > this.height();
    }
})(jQuery);

(function($) {
    $.fn.hasHScrollBar = function() {
        return this.get(0).scrollWidth > this.width();
    }
})(jQuery);

Date.daysInMonth = function(year, month){  
  //Day 0 is the last day in the previous month  
  return new Date(year, month, 0).getDate();
}

function Today(){
  var today = new Date();
  var d = today.getDate();
  //January is 0!
  var m = today.getMonth() + 1; 
  var yyyy = today.getFullYear();
  var dd = d<10 ? "0" + d : "" + d; 
  var mm = m<10 ? "0" + m : "" + m;

  var h=today.getHours();
  var min=today.getMinutes();
  var sec=today.getSeconds();
  min = checkTime(min);
  sec = checkTime(sec);
  var ampm = h >= 12 ? 'pm' : 'am';
  var hr = (h%12==0) ? 12:(h%12);
  var hms = (hr+":"+min+":"+sec+" "+ampm);
  var hm = (hr+":"+min+" "+ampm);
  
  var weekday = getWeekdayMap()[today.getDay()]
  var monthName = getMonthYearMap()[today.getMonth()]
  return {
    date: today
    , day : d
    , month: m
    , monthName: monthName
    , year : yyyy
    , weekday : weekday
    , summary : mm+'/'+dd+'/'+yyyy
    , time: hm
    , timeDetail: hms
    , toString : weekday + ", " + monthName + " " + dd + ", " + yyyy
  }
}

function getWeek(){
 return {
	 Su: null
   , Mo: null
   , Tu: null
   , We: null
   , Th: null
   , Fr: null
   , Sa: null
 }
}

function SysCalendar(){
  var clockInterval = null;
  var selectedDate = new Date(Today().toString);
  
  var selectedYear = 0;
  var selectedMonth = 0;
  var selectedDay = 0;
  
  function init(defaultYear, defaultMonth, defaultDay){
    var calendarWidthConst = 314;
    var monthIndex = defaultMonth ? defaultMonth : 0;//0=jan,feb=1,..,10=nov,11=dec
    var selectedDay = defaultDay ? defaultDay : null;
    
    $('.calendar','#SystemClock').html(BuildCalendarHTML(defaultYear));
    
    //get ui-button elements
    var monthSelection = $('.calendar-year .month-selection','#SystemClock');
    var months 		= $('.calendar-year .months','#SystemClock');
    var monthYr 		= $('.calendar-year .month-year','#SystemClock');
    var monthYrUp 	= $('.calendar-year .month-year-up','#SystemClock');
    var monthYrDown 	= $('.calendar-year .month-year-down','#SystemClock');
    var todaysDate 	= $('.calendar-year .datetime .date', '#SystemClock');
    var todayElement	= $('.calendar-year .today', '#SystemClock');
    var dateElement 	= $('.calendar-year .day', '#SystemClock');
    var monthElement 	= $('.calendar-year .month-option', '#SystemClock');

    function updateDate(){
      $('.date', '#SystemClock').html('<a href="#" onclick="return false;">' + Today().toString + '</a>');
    }
    
    function updateTime(){
    	$('.time', '#SystemClock').html(Today().timeDetail.toUpperCase());
    }
    
    function updateDateTime(){
    	updateDate();
      	updateTime();
    }
    
    function clearSelectedDay(){
      $('.calendar-year .day', '#SystemClock').removeClass('day-selected');
      selectedDate = new Date(Today().toString);
      
      selectedYear = 0;
      selectedMonth = 0;
      selectedDate = 0;
    }

    function showMonth(index){
    	months.css('margin-left', (-calendarWidthConst * index) +"px");
    }
    
    function selectDay(month, day){
      	clearSelectedDay();
    	$('.calendar-year .month', '#SystemClock')
          .eq(month)
          .find('.day')
          .filter(function(i){ return $(this).text() == day+""})
          .addClass('day-selected');
    }
    
    function showTodaysMonth(){
      monthIndex = Today().month - 1;
      setYear(Today().year, monthIndex, Today().day);
    }

    //define click event handlers
    var monthYrClick = function(e){
      monthSelection.show();
      months.hide();
      monthSelection.children().removeClass('selected-month').filter(function(i){
      	return $(this).index() == monthIndex + 1;
      }).addClass('selected-month');
    };
    
    var monthYrUpClick = function(e){
      if(monthIndex - 1 >= 0){
        monthIndex--;
      } else {
        monthIndex = 11;
        setYear(defaultYear - 1, monthIndex);
      }
      showMonth(monthIndex);
    };
    
    var monthYrDownClick = function(e){
      if(monthIndex + 1 <= 11){
        monthIndex++;
      } else {
        monthIndex = 0;
        setYear(defaultYear + 1, monthIndex);
      }
      showMonth(monthIndex);
    };

    var todaysDateClick = function(e){
      clearSelectedDay();
      selectedDate = new Date(Today().toString);
      showTodaysMonth();
    };

    var dateElementClick = function(e){
      clearSelectedDay();
      selectedDate = new Date($(this).attr('date'));
      
      selectedYear = selectedDate.getFullYear();
      selectedMonth = selectedDate.getMonth();
      selectedDate = selectedDate.getDate();
      
      $(this).addClass('day-selected');
    };
    
    var monthElementClick = function(e){
      monthSelection.hide();
      months.show();
      showMonth(monthIndex=$(this).index()-1);
    };

    //register click events
    monthYr.click(monthYrClick);
    monthYrUp.click(monthYrUpClick);
    monthYrDown.click(monthYrDownClick);
    todaysDate.click(todaysDateClick);
    dateElement.click(dateElementClick);
    monthElement.click(monthElementClick);
    
    //call private functions
    showMonth(monthIndex);
    if(selectedDay) {
      selectDay(monthIndex, selectedDay);
    }
    updateDateTime();
    
    //return interval object so it may be disposed
    return setInterval(function(){
      updateTime();
    }, 1000);
  }
  
  function dispose(interval){
    if(interval) clearInterval(interval);
  	$('.calendar','#SystemClock').empty(); 
  }
  
  function setYear(year, month, day) {
    dispose(clockInterval); 
    clockInterval = init(year, month, day);
  }
  //Clock Interval
  clockInterval = init(Today().year, Today().month-1, Today().day);
}


function BuildCalendarHTML(year){
  var html = '<div class="calendar-year">';
  var ThisYear = Calendar(year);
  html += '<div class="datetime">';
  html += '		<div class="time">&nbsp;</div>';
  html += '		<div class="date">&nbsp;</div>';
  html += '</div>';
  html += '<div class="month-selection" style="display:none;">';
  html += '		<div class="month-title">';
  html += '			<div style="float:right;">';
  html += '				<i class="month-year-up glyphicon glyphicon-chevron-up"></i>';
  html += '				<i class="month-year-down glyphicon glyphicon-chevron-down"></i>';
  html += '			</div>';
  html += '			<span class="month-year">'+ year +'</span>';
  html += '		</div>';
  html += '		<div class="month-option">Jan</div>';
  html += '		<div class="month-option">Feb</div>';
  html += '		<div class="month-option">Mar</div>';
  html += '		<div class="month-option">Apr</div>';
  html += '		<div class="month-option">May</div>';
  html += '		<div class="month-option">Jun</div>';
  html += '		<div class="month-option">Jul</div>';
  html += '		<div class="month-option">Aug</div>';
  html += '		<div class="month-option">Sep</div>';
  html += '		<div class="month-option">Oct</div>';
  html += '		<div class="month-option">Nov</div>';
  html += '		<div class="month-option">Dec</div>';
  html += '</div>';
  html += '<div class="months">';
  
  for(var month in ThisYear){
     html += '<div class="month">';
    	html += '<div class="month-title">';
    	html += '	<div style="float:right;">';
    	html += '		<i class="month-year-up glyphicon glyphicon-chevron-up" />';
    	html += '		<i class="month-year-down glyphicon glyphicon-chevron-down" />';
    	html += '	</div>';
    	html += '	<span class="month-year">'+month+' '+year+'</span>';
    	html += '</div>';
    	html += '<div class="weekdays">';
    	html += '	<span class="weekday">Su</span>';
        html += '	<span class="weekday">Mo</span>';
        html += '	<span class="weekday">Tu</span>';
        html += '	<span class="weekday">We</span>';
        html += '	<span class="weekday">Th</span>';
        html += '	<span class="weekday">Fr</span>';
        html += '	<span class="weekday">Sa</span>';
    	html += '</div>';
    	html += '<div class="days">';
        for(var i=0;i<ThisYear[month].length;i++){
          var date = ThisYear[month][i];
          //add weekday padding until first of month
          if(date.getDate() == 1){
            for(var j=0;j<date.getDay();j++){
              html += '<span class="day" style="border: solid 1px transparent;">&nbsp;</span>';
            }
          }
          var isDateToday = Today().year == date.getFullYear() 
            && Today().monthName == month
          	&& Today().day == date.getDate();
          if( isDateToday ){
            html += '<span class="day today" date="'+date.toString()+'">'+date.getDate()+'</span>';
          }
          else{
          	html += '<span class="day" date="'+date.toString()+'">'+date.getDate()+'</span>';
          }
        }
    	html += '</div>';
    html += '</div>';
  }
  html += '</div>';
  html += '<div class="schedule-task">';
  html += '		<a href="#" onclick="return false;">Schedule Task or Event</a>';
  html += '</div>';
  html +='</div>';
  return html;
}

function Calendar(year){
  var weeks = getWeeksInYear(year);
  var Calendar = {
    January:[]
    , February:[]
    , March:[]
    , April:[]
    , May:[]
    , June:[]
    , July:[]
    , August:[]
    , September:[]
    , October:[]
    , November:[]
    , December:[]
  };
  for(var i in weeks){
    var week = weeks[i];
    for(var day in week){
      var date = week[day];
      if(date){
        var monthFullName = getMonthYearMap()[date.getMonth()];
        var monthAbbvr = monthFullName;
        Calendar[monthAbbvr].push(date);
      }    
    }
  }
  return Calendar;
}

function isWeekEmpty(week){
  for(var weekday in week){
  	if(week[weekday]!=null) return false;  
  }
  return true;
}

function getWeeksInYear(yr) {
  var weekday = getWeekdayMap();
  var weeksInYear = [];
  var year = getCalendarYear(yr);
  var totalDays = 0;
  for(var month in year){
    var days = year[month];
    var week = getWeek();
    for(var day in days){
      totalDays++;
      var time = days[day];
      if(time.weekday == "Sunday") {
        if(!isWeekEmpty(week)) weeksInYear.push(week);
        week = getWeek();
      }
      week[time.weekday.substr(0,2)] = time.date;
    }
   	if(!isWeekEmpty(week)) weeksInYear.push(week);
  }
  return weeksInYear;
}

function printDaysInMonth(year){
  var year = getCalendarYear(year);
  for(var m in year){
    var month = year[m];
    for(var d in month){
      var day = month[d];
      console.log(day.weekday+", "+day.monthFullName+" "+day.day+", "+day.year);
    }
  }
}

function getWeekdayMap(){
  var weekday = new Array(7);
  weekday[0]=  "Sunday";
  weekday[1] = "Monday";
  weekday[2] = "Tuesday";
  weekday[3] = "Wednesday";
  weekday[4] = "Thursday";
  weekday[5] = "Friday";
  weekday[6] = "Saturday";
  return weekday;
}

function getMonthYearMap(){
  var months = new Array(12);
  months[0] = 'January';
  months[1] = 'February';
  months[2] = 'March';
  months[3] = 'April';
  months[4] = 'May';
  months[5] = 'June';
  months[6] = 'July';
  months[7] = 'August';
  months[8] = 'September';
  months[9] = 'October';
  months[10] = 'November';
  months[11] = 'December';
  return months;
}

function getCalendarYear(year){
  var calendarYear = {};
  var days = getDaysInMonth(year);
  for(var monthFullName in days){ 
    calendarYear[monthFullName] = {};
    for(var day=1;day<=days[monthFullName];day++){
      var date = new Date(monthFullName+" "+day+", "+year);
      var weekday = getWeekdayMap();
      calendarYear[monthFullName][day] = { 
        year:   year
        , month : date.getMonth() + 1 
        , monthFullName:  monthFullName
        , day:    day
        , weekday:weekday[date.getDay()]
        , date:   date
      };
    }
  }
  return calendarYear;
}

function getDaysInMonth(year){
  var m = getMonthYearMap();
  var months = {};
  for(var month=1 ; month <= 12; month++) {
    months[m[month-1]] = Date.daysInMonth(year, month);
  }
  return months;
}

function ShowLoadingDialog(winId){
  var widthOffset =  $('.win-body-center-panel', Id(winId)).hasVScrollBar() ? 20 : 0;
  $('.loading-dialog', Id(winId)).show();
  $('.loading-dialog', Id(winId)).width($('.win-body-center-panel', Id(winId)).width()-widthOffset);
  $('.loading-dialog', Id(winId)).height($('.win-body-center-panel', Id(winId)).height());
}

function PrintDiskInfo(){
  var screenId = Id(NewScreen());
  SocketPostAsync([{cmd:"shell", args:"sudo fdisk -l"}], function(result){ 
    var data = result[0].response.data.string;
    $(screenId).find(".win-body").html("<pre>"+data+"</pre>");
  });
}

function PrintDiskDetails(){
  var screenId = Id(NewScreen());
  SocketPostAsync([{cmd:"shell", args:"sudo df -h"}], function(result){ 
    var data = result[0].response.data.string;
    $(screenId).find(".win-body").html("<pre>"+data+"</pre>");
  });
}

function PrintSystemInfo(){
  var screenId = Id(NewScreen());
  SocketPostAsync([{cmd:"shell", args:"sudo lshw"}], function(result){ 
    var data = result[0].response.data.string;
    $(screenId).find(".win-body").html("<pre>"+data+"</pre>");
  });
}

function AddPanelsToScreen(winId){
  var winId = Id(winId);
  var style= 'position:absolute; top:30px; bottom:40px; left: 0; right:0; overflow: auto; padding-left: 200px;';

  $centerPanel = $('<div class="win-body-center-panel" style="'+style+'"></div>');

  $menu = $('<div class="win-body-menu"></div>');

  $header = $('<div class="win-body-toolbar"></div>');

  $footer = $('<div class="win-body-footer"></div>');

  $leftSidePanel = $('<div class="win-body-left-panel"></div>').width(0);

  $rightSidePanel = $('<div class="win-body-right-panel"></div>').width(0);

  $(winId)
    .attr('window', 'true')
    .find('div.win-body')
    .empty()
    //.html($menu)
    .append($header)
    .append($centerPanel)
    .append($leftSidePanel)
    .append($rightSidePanel)
    .append($footer);

  var $leftPanel = $(winId).find('.win-body-left-panel');
  var resizeLeftPanel = function(e, ui){
    var pWidth = $leftPanel.parent().width();
    var lWidth = $leftPanel.innerWidth();
    $(winId).find(".win-body-center-panel").css('padding-left', lWidth+'px');
  };
  $leftPanel[0].onResize = resizeLeftPanel;
  $leftPanel.resizable({
    handles: 'e'
    , resize: resizeLeftPanel
  });

  var $rightPanel = $(winId).find('.win-body-right-panel');
  var resizeRightPanel = function(e, ui){
    $rightPanel.css('right',0).css('left','');
    var pWidth = $rightPanel.parent().width();
    var rWidth = $rightPanel.width();
    $(winId).find(".win-body-center-panel").css('right', rWidth+'px');
  };
  $rightPanel[0].onResize = resizeRightPanel;
  $rightPanel.resizable({
    handles: 'w'
    , resize: resizeRightPanel
  });

  //grab onresize callback function from NewWindow()
  var origOnResize = $(winId)[0].onResize ? $(winId)[0].onResize:function(){};

  $(winId)[0].onResize = function(){
    origOnResize();
    resizeLeftPanel();
    resizeRightPanel();
  }
  $(winId)[0].onResize();

  var panels = { 
    menu	: $menu
    , header 	: $header
    , left	: $leftPanel
    , right	: $rightPanel
    , center 	: $centerPanel
    , footer 	: $footer
  };

  return { 
    window: $(winId)
    , panels: panels
    , update: $(winId)[0].onResize
  }
}
function NewScreen(title, opts){
  return Screen($.extend({
    title:title?title:'Window'
    , subheader: false
    , content: null 
    , execute:function(winId, str){
      console.log(winId, str);
    }
    , onresize: function(e, ui){
      //console.log(e, ui);
      //triggered by jquery resize event and invoked manually by maximize event
      var winObj = ui.element && ui.element.length>0 ? ui.element[0] : ui[0];
      //if(winObj.onResize) winObj.onResize();
      if($(winObj).find(".win-body-left-panel").size() > 0) $(winObj).find(".win-body-left-panel") [0].onResize();
      if($(winObj).find(".win-body-right-panel").size() > 0)$(winObj).find(".win-body-right-panel")[0].onResize();

    }
    , onopen:function(e, win){
      //$(win).find('.panel-sub-heading').hide();
    }}, opts));
}
function NewBrowser(title){
  return Screen({
    title:title?title:'Window'
    , subheader: true
    , content: null 
    , execute:function(winId, str){
      console.log(winId, str);
    }
    , onresize: function(e, ui){
      //console.log(e, ui);
      //triggered by jquery resize event and invoked manually by maximize event
      var winObj = ui.element && ui.element.length>0 ? ui.element[0] : ui[0];
      //if(winObj.onResize) winObj.onResize();
      if($(winObj).find(".win-body-left-panel").size() > 0) $(winObj).find(".win-body-left-panel") [0].onResize();
      if($(winObj).find(".win-body-right-panel").size() > 0)$(winObj).find(".win-body-right-panel")[0].onResize();

    }
    , onopen:function(e, win){
      //$(win).find('.panel-sub-heading').hide();
    }});
}
function InvokeTerminal(){
  var screenId = NewScreen('Terminal');
  let sh = function(cmd, cb){
    $.getJSON('/user?cwd=/&cmd=sh&args=["-c", "' + cmd + '"]&json=true', json=>{
      if(cb) cb(json);
    });
  }
  let html = '<div style="height:100%; background-color: black; color: green;">';
  
  html += '<div id="output" style="overflow-y: scroll; padding-top:30px; margin-top: -30px;height: 100%;"></div>';
  html += '<div class="input" style="height: 30px;">';
  html += '<div style="display:table; width: 100%;height: 100%;">\
          <div id="cwdLabel" style="background-color:black; line-height: 30px;padding: 0 3px;display: table-cell; width: 1%;height: 100%;">rusty@desktop:/$&nbsp;</div>\
          <input id="cmd" name="cmd" style="color:white; background: black; outline:none; border:none; display: table-cell; width: 100%;height: 100%;" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" />\
        </div>';
  html += '</div>';
  html += '</div>';
  let $html = $(html), 
      cmd = $html.find('#cmd'),
      cwd = $html.find('#cwdLabel'),
      output = $html.find("#output");
  cmd.keydown(e=>{
    if(e.keyCode == 13){
      let tmpVal = cmd.val();
      sh(tmpVal, json=>{
        let stderr = cwd.text() + tmpVal + '\n' + json.stderr,
            stdout = cwd.text() + tmpVal + '\n' + json.stdout;
        if(json.stderr.length > 0){
          output.append('<pre style="border-radius:0; margin:2px; padding:1px; color:maroon; background-color: #111;">' + stderr + '</pre>');
        } else {
          output.append('<pre style="border-radius:0; margin:2px; padding:1px; color:white; background-color: #111;">' + stdout + '</pre>');
        }
        var objDiv = document.getElementById("output");
		objDiv.scrollTop = objDiv.scrollHeight;
      });
      cmd.val('');
    }
  });
  $(Id(screenId)).find('.win-body').html($html); 
}
function InvokeSystem(){
	AppWebSocket.send(JSON.stringify([{cmd:'os'}]));
}
function InvokeMain(){
  var icon ='<span class="el el-laptop" style="margin-right: 4px;"></span>';
  var screenId = NewBrowser(icon + 'Main');
  var app = AddPanelsToScreen(screenId);
  app.panels.left.width(250);
  var newPanelHtml = function(icon, title, content){
    var html = '<div class="panel">';
    var quickAccessIcon1 = '<i class="glyphicon glyphicon-chevron-right" style="margin:0 5px 0 5px;"></i>';
    var quickAccessIcon2 = '<i class="' + icon + '" style="margin-right: 3px;"></i>';
    var quickAccessIcons = quickAccessIcon1 + quickAccessIcon2;
    html += '<div class="panel-title" style="cursor: pointer;">' + quickAccessIcons + title + '</div>';
    html += '<div class="panel-body">' + content + '</div>';
    html += '</div>';
    return html;
  };
 
  app.panels.left.append(newPanelHtml('glyphicon glyphicon-star'
    ,'Frequently used','Empty'));
  app.panels.left.append(newPanelHtml('el el-website'
    ,'Dashboards','Empty'));
  app.panels.left.append(newPanelHtml('el el-laptop'
    ,'File System', newPanelHtml('el el-laptop','C:\\','')));
   app.panels.left.append(newPanelHtml('el el-cogs'
    ,'Administration','Empty'));
  app.panels.left.append(newPanelHtml('el el-th'
    ,'Applications','Empty'));
  app.panels.left.append(newPanelHtml('glyphicon glyphicon-thumbs-up'
    ,'Services','Empty'));
}
function InvokeEditor(){
    var path = "*New.txt";
    var html = "";
	var fileExt = path.substr(path.lastIndexOf('.') + 1);
    var mode = getEditorModeByFileExt(fileExt);
    ScriptEditor(path, html, mode);
}
function InvokeBrowse(){
 var screenId = NewBrowser('<span class="glyphicon glyphicon-calendar" style="margin-right: 4px;"></span> Browse');
 var result = AddPanelsToScreen(screenId);
var iframe = '<iframe src="http://stacknext.com" style="width: 100%; height: 100%;" frameborder="false"></iframe>';
  result.panels.center.append(iframe);
  //randomly position screen in Q-II
  var posX = getRandomInt(100, window.innerWidth/2),
      posY = getRandomInt(100, window.innerHeight/2);
  $(Id(screenId)).css({
  	  left: posX
    , top: posY
  });
}
function UserTimeFormat(date){
 return moment(date).format('dddd, MMMM DD, YYYY hh:mm:ss A');
}

function InvokeFunctionBuilder(){
  var screenId = NewScreen('Function Builder');
  var html = '';
  	html+='<form style="height:100%;">';
    html+='		function <input type="text" name="title" placeholder="Name" />&nbsp;';
    html+='		(<input type="text" name="args"  placeholder="Arguments"/>) { //version 123456';
    html+='		<div style="overflow:hidden;">';
    html+='			<textarea  style="width: 100%; height:100%;" name="context"  placeholder="Context"></textarea>';
    html+='		</div>';
    html+='		<div>}</div>';
    html+='		<div>';
    html+='			<button>Save</button>';
    html+='		</div>';
  	html+='</form>';
	$(Id(screenId)).find('.win-body').html(html);
}

function InvokeProperties(path, props){
  if(path!=null && props!=null){
    var readonly = false;
   	var inputReadOnly = readonly ? "readonly" : "";
    var fileExt = path.substr(path.lastIndexOf('.'));
    var parentDir = path.substr(0, path.lastIndexOf('/'));
    var screenId = NewScreen('<span class="glyphicon glyphicon-cog" style="margin-right: 4px;"></span> Properties');
    var result = AddPanelsToScreen(screenId);
    var tabs = '<ul class="nav nav-tabs" role="tablist">\
                  <li role="presentation" class="active"><a href="#general-'+screenId+'" onclick="return false;">General</a></li>\
                  <li role="presentation"><a href="#security-'+screenId+'" onclick="return false;">Security</a></li>\
                  <li role="presentation"><a href="#details-'+screenId+'" onclick="return false;">Details</a></li>\
                  <li role="presentation"><a href="#version-'+screenId+'" onclick="return false;">Version</a></li>\
                </ul>';
    var content='';
    var general_table = '<table class="table table-striped">';
	var pathName = props.methods.isFile ? path.substr(path.lastIndexOf('/') + 1) : path;
    general_table += '<tr>';
    general_table += '<td><i class="glyphicon glyphicon-file" /></td>';
    general_table += '<td><span style="overflow: hidden;"><input '+inputReadOnly+' style="width: 100%" type="input" value="'+pathName+'"/></span></td>';
    general_table += '</tr>';

    general_table += '<tr>';
    general_table += '<td>Type of file:</td>';
    
    general_table += '<td>' + (props.methods.isFile ? fileExt : "Folder") + '</td>';
    general_table += '</tr>';

    general_table += '<tr>';
    general_table += '<td>Opens with:</td>';
    general_table += '<td></td>';
    general_table += '</tr>';

    general_table += '<tr>';
    general_table += '<td>Location:</td>';
    general_table += '<td>' + parentDir + '</td>';
    general_table += '</tr>';

    general_table += '<tr>';
    general_table += '<td>Size:</td>';
    general_table += '<td>'+props.stats.size+'</td>';
    general_table += '</tr>';

    general_table += '<tr>';
    general_table += '<td>Size on disk:</td>';
    general_table += '<td></td>';
    general_table += '</tr>';
    
    general_table += '<tr>';
    general_table += '<td>Contains:</td>';
    general_table += '<td>Files, Folders</td>';
    general_table += '</tr>';

    general_table += '<tr>';
    general_table += '<td>Created:</td>';
    general_table += '<td>'+UserTimeFormat(props.stats.ctime)+'</td>';
    general_table += '</tr>';

    general_table += '<tr>';
    general_table += '<td>Modified:</td>';
    general_table += '<td>'+UserTimeFormat(props.stats.mtime)+'</td>';
    general_table += '</tr>';

    general_table += '<tr>';
    general_table += '<td>Accessed:</td>';
    general_table += '<td>'+UserTimeFormat(props.stats.atime)+'</td>';
    general_table += '</tr>';

    general_table += '<tr>';
    general_table += '<td>Attributes:</td>';
    general_table += '<td></td>';
    general_table += '</tr>';

    general_table += '<tr>';
    general_table += '<td>Security:</td>';
    general_table += '<td></td>';
    general_table += '</tr>';

    general_table += '</table>';
    content += '<div id="general-'+screenId+'" style="display:block; margin: 5px;">'+general_table+'</div>';
    content += '<div id="security-'+screenId+'" style="display:none; margin: 5px;"></div>';
    content += '<div id="details-'+screenId+'" style="display:none; margin: 5px;"></div>';
    content += '<div id="version-'+screenId+'" style="display:none; margin: 5px;"></div>';
    var div = '<div style="padding: 5px;">'+tabs+'</div>';
    var buttons = '<div style="position: absolute; bottom: 0; right: 0; margin: 5px;">';

    buttons += '<button style="width: 55px; margin-right: 3px;">OK</button>';
    buttons += '<button style="width: 55px; margin-right: 3px;">Cancel</button>';
    buttons += '<button style="width: 55px; margin-right: 3px;">Apply</button>';

    buttons += '</div>';

    result.panels.left.css({top: 0, bottom: 0});
    result.panels.right.css({top: 0, bottom: 0});
    result.panels.center.css({top: 0, bottom: 0}).append(div + content + buttons);
    result.panels.header.height(0);
    result.panels.footer.height(0);
    //result.panels.center.closest('.win-body').css({padding: "10px"})
    //randomly position screen in Q-II
    var posX = getRandomInt(100, window.innerWidth/2),
        posY = getRandomInt(100, window.innerHeight/2);
    $(Id(screenId)).css({
      left: posX
      , top: posY
    }).width(400).height(560);
  }
}
function InvokeCalendar(){
 var screenId = NewScreen('<span class="glyphicon glyphicon-calendar" style="margin-right: 4px;"></span> Calendar');
 var result = AddPanelsToScreen(screenId);
 result.panels.left.width(275).append('<div class="list-group" style="padding: 5px;">\
            <div id="calendar-inline"></div>\
          </div>');
  //randomly position screen in Q-II
  var posX = getRandomInt(100, window.innerWidth/2),
      posY = getRandomInt(100, window.innerHeight/2);
  $(Id(screenId)).css({
  	  left: posX
    , top: posY
  });
  $( "#calendar-inline" ).datepicker();
}
function InvokeTaskManager(){
  var windowClosedEvent = null;
  var screenId = NewScreen('<span class="glyphicon glyphicon-cog" style="margin-right: 4px;"></span>Task Manager', 
  { 
    onclose : function(e, win){ 
        if(windowClosedEvent) windowClosedEvent();
  	}
  });
  var tabs = '<ul style="margin-top: 1px;" class="nav nav-tabs" role="tablist">\
                  <li role="presentation" class="active"><a href="#apps-'+screenId+'" onclick="return false;">Apps</a></li>\
                  <li role="presentation"><a href="#processes-'+screenId+'" onclick="return false;">Processes</a></li>\
                  <li role="presentation"><a href="#services-'+screenId+'" onclick="return false;">Services</a></li>\
                  <li role="presentation"><a href="#performance-'+screenId+'" onclick="return false;">Performance</a></li>\
				  <li role="presentation"><a href="#users-'+screenId+'" onclick="return false;">Users</a></li>\
                </ul>';
  var divs = '<div id="apps-'+screenId+'" style="overflow:scroll;width:100%;height:100%;"></div>';
  divs += '<div id="processes-'+screenId+'" style="overflow:scroll;width:100%;height:100%;"></div>';
  divs += '<div id="services-'+screenId+'" style="overflow:scroll;width:100%;height:100%;"></div>';
  divs += '<div id="performance-'+screenId+'" style="overflow:scroll;width:100%;height:100%;">\
    <iframe width="100%" height="100%" src="/performance.html" frameborder="0"></iframe>\
      </div>';
  divs += '<div id="users-'+screenId+'" style="overflow:scroll;width:100%;height:100%;"></div>';
  
  $(Id(screenId)).find('.win-body').html(tabs + divs);
  //hide divs
  $(Id(screenId)).find('.win-body > div').hide();
  
  var UpdateProcessessTable = function(info){
  	var tableHtml = '<table class="table table-striped">';
      tableHtml += '<tr>';
      tableHtml += '<td>PID</td>';  
      tableHtml += '<td>Process</td>';
      tableHtml += '<td>User</td>';
      tableHtml += '<td>CPU</td>';
      tableHtml += '<td>Memory</td>';
      tableHtml += '</tr>';
    for(var i in info){
      tableHtml += '<tr>';
      tableHtml += '<td>'+info[i].pid+'</td>';
      tableHtml += '<td>'+info[i].cmd+'</td>';
      tableHtml += '<td>'+info[i].user+'</td>';
      tableHtml += '<td>'+info[i].cpu+'</td>';
      tableHtml += '<td>'+info[i].mem+'</td>';
      tableHtml += '</tr>';  
    }
    tableHtml+='</table>';
    $(Id(screenId)).find('#processes-'+screenId).html(tableHtml);
  }
 
  $(Id(screenId)).find('.win-body a').click(function(){
    $(Id(screenId)).find('.win-body > div').hide();
    $(Id(screenId)).find('.win-body > ul li').removeClass("active");
    $($(this).attr('href')).parent().addClass("active");
  	$($(this).attr('href')).show();
  });
  
  var taskInterval = setInterval(function(){
  	GetProcessInfo(function(info){
    	console.log(info.length+" processes running.");
      	UpdateProcessessTable(info);
    }, "cpu");
  }, 1000);
  
  windowClosedEvent = function(){
    clearInterval(taskInterval);
  }

  
}
function InvokeMyAccount() {
  var screenId = NewScreen('<span class="glyphicon glyphicon-cog" style="margin-right: 4px;"></span>My Account');
  var result = AddPanelsToScreen(screenId);
  result.panels.left.width(300).append('<div class="list-group" style="padding: 5px;">\
            <a href="#myaccount" class="list-group-item">\
              <h4 class="list-group-item-heading">My Account</h4>\
              <p class="list-group-item-text">Manage account settings here.</p>\
            </a>\
			<a href="#billing-overview" class="list-group-item">\
              <h4 class="list-group-item-heading">Billing Overview</h4>\
              <p class="list-group-item-text">Manage payment informion.</p>\
            </a>\
            <a href="#payment-methods" class="list-group-item">\
              <h4 class="list-group-item-heading">Payment Methods</h4>\
              <p class="list-group-item-text">Manage payment informion.</p>\
            </a>\
			<a href="#order-history" class="list-group-item">\
              <h4 class="list-group-item-heading">Order History</h4>\
              <p class="list-group-item-text">Manage payment informion.</p>\
            </a>\
          </div>');
  result.panels.center.html('<div style="padding: 5px;">\
<div id="#myaccount">\
<iframe width="100%" height="500" src="myaccount" frameborder="0"></iframe>\
</div>\
<div id="#billing-overview"><h3>Billing Overview</h3>\
<iframe width="100%" height="500" src="/billing" frameborder="0"></iframe>\
</div>\
<div id="#payment-methods">\
<iframe width="100%" height="500" src="/payment_methods" frameborder="0"></iframe>\
</div>\
<div id="#order-history"><h3>Order History</h3></div></div>');
  result.panels.left.find('a').click(function(){
  	result.panels.center.find('div div').hide();
    var id = $(this).attr('href');
    result.panels.center.find("div div[id="+id+"]").show();
    return false;
  });
  result.panels.center.find('div div').hide();
  result.panels.center.find("div div[id=#myaccount]").show();
  result.update();
}
function InvokeSettings(){
 var screenId = NewScreen('<span class="glyphicon glyphicon-cog" style="margin-right: 4px;"></span>Settings');
 var result = AddPanelsToScreen(screenId);
 result.panels.left.width(300).append('<div class="list-group" style="padding: 5px;">\
            <a href="#" class="list-group-item">\
              <h4 class="list-group-item-heading">Background</h4>\
              <p class="list-group-item-text">Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.</p>\
            </a>\
            <a href="#" class="list-group-item">\
              <h4 class="list-group-item-heading">Colors</h4>\
              <p class="list-group-item-text">Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.</p>\
            </a>\
            <a href="#" class="list-group-item">\
              <h4 class="list-group-item-heading">Themes</h4>\
              <p class="list-group-item-text">Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.</p>\
            </a>\
			<a href="#" class="list-group-item">\
              <h4 class="list-group-item-heading">Next</h4>\
              <p class="list-group-item-text">Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.</p>\
            </a>\
          </div>');
  //randomly position screen in Q-II
  var posX = getRandomInt(100, window.innerWidth/2),
      posY = getRandomInt(100, window.innerHeight/2);
  $(Id(screenId)).css({
  	  left: posX
    , top: posY
  });
}
function InvokeFileExplorer(){
  var screenId = Screen({
    title:'<span class="glyphicon glyphicon-cloud" style="margin-right: 4px;"></span>\
		File System'
    , content:'Enter a command to execute.'
    , execute:function(winId, str){
      if(str[0]==('/')){
        var cmd = JSON.stringify([{ cmd: "dir", path : str, id : winId }]);
        //console.log(cmd);
        AppWebSocket.send(cmd);
      } else{			
        var cmd = JSON.stringify([{ cmd: str, path : '', id : winId }]);
        //console.log(cmd);
        AppWebSocket.send(cmd);
      }
    }
    , onresize: function(e, ui){
      //console.log(e, ui);
      //triggered by jquery resize event and invoked manually by maximize event
      var winObj = ui.element && ui.element.length>0 ? ui.element[0] : ui[0];
      $(winObj).find(".accordion").accordion( "refresh" );
      if($(winObj).find(".win-body-left-panel").size() > 0) $(winObj).find(".win-body-left-panel") [0].onResize();
      if($(winObj).find(".win-body-right-panel").size() > 0)$(winObj).find(".win-body-right-panel")[0].onResize();

    }
    , onopen:function(e, win){
      setTimeout(function(){
        //console.log(win.find('.win-body-right-panel').width(0));
        win
          .width(600)
          .height(400)
          .find('.path')
          .val('/')
          .trigger($.extend(
          $.Event('keydown')
          , { keyCode:13 }
        ));
      }, 10);
    }});
  //randomly position screen in Q-II
  var posX = getRandomInt(100, window.innerWidth/2),
      posY = getRandomInt(100, window.innerHeight/2);
  $(Id(screenId)).css({
  	  left: posX
    , top: posY
  });
  return screenId;
}
function ResizeIframe(win, doc){
 alert('Resize Iframe!'+$(doc).width()+"x"+$(doc).height());
  console.log(win ,doc);
}

function GetProcessInfo(callback, sort){
  var shellURL = '/shell?raw=1&cmd=ps aux';
  if(sort){
  	switch(sort){
      case "memory":   
         shellURL += ' --sort -rss';
        break;
        case "cpu":   
         shellURL += ' --sort -c';
        break;
    }
  }
  $.get(shellURL, function(data){
    var lines = data.split('\n');
    var json=[];
    for(var i in lines){
      if(i==0)continue;
      var words = lines[i].replace(/\s+/g," ").split(' ');
      var cleanedWords = (words.slice(0, 10).join(', ') + ", " + words.slice(10, words.length).join(' ')).split(', ');
      var getJsonWords = function(){
        return { 
          user: cleanedWords[0], 
          pid: cleanedWords[1],
          cpu: cleanedWords[2],
          mem: cleanedWords[3],
          vsz: cleanedWords[4],
          rss: cleanedWords[5],
          tty: cleanedWords[6],
          stat: cleanedWords[7],
          start: cleanedWords[8],
          time: cleanedWords[9],
          cmd: cleanedWords[10]
        };
      };
      var jsonWords = getJsonWords();
      if(jsonWords.pid)
      	json.push(jsonWords);
    }
    if(callback)callback(json);
  });
}

function CreateWebSocket(handleOpen, handleMessage, handleClosed){
  var ws = null;
  if ("WebSocket" in window)
  {
    ws = new WebSocket("ws://www.tritonbox.com/echo");
    ws.onopen = function()
    {
      if(handleOpen) handleOpen(ws);
    };

    ws.onmessage = function (evt) 
    { 
      if(handleMessage) handleMessage(ws, evt);
    };

    ws.onclose = function()
    { 
      if(handleClosed) handleClosed(ws);
    };
  }
  return ws;
}
function CalcThroughput(bytesToSend){
  var bytesReceived = 0;
  var startTime = null;
  var endTime = null;
  var byteSize = 10;
  var max=bytesToSend / byteSize;
  var GB=1000000000;
  var MB=1000000;
  var KB=1000;
  var ws = CreateWebSocket(
    function(socket) {
      console.log("Sending "+bytesToSend+" bytes");
      startTime = Date.now();
      for(var i=0;i<max;i++) {
        socket.send("bytes");
      }
    }
    , function(socket, e){ 
      bytesReceived += byteSize;
      if(bytesReceived == KB) {
        endTime = Date.now() 
        var sec = (endTime - startTime) / 1000; 
        console.log("1KB received in "+sec+" seconds", ((bytesReceived / KB).toFixed(3) / sec) + " KB/sec");
      }
      else if(bytesReceived == MB) {
        endTime = Date.now() 
        var sec = (endTime - startTime) / 1000; 
        console.log("1MB received in "+sec+" seconds", ((bytesReceived / MB).toFixed(3) / sec) + " MB/sec");
      }
      else if(bytesReceived == 5*MB) {
        endTime = Date.now() 
        var sec = (endTime - startTime) / 1000; 
        console.log("5MB received in "+sec+" seconds", ((bytesReceived / MB).toFixed(3) / sec) + " MB/sec");
      }
      else if(bytesReceived == 10*MB) {
        endTime = Date.now() 
        var sec = (endTime - startTime) / 1000; 
        console.log("10MB received in "+sec+" seconds", ((bytesReceived / MB).toFixed(3) / sec) + " MB/sec");
      }
      else if(bytesReceived == 100*MB) {
        endTime = Date.now() 
        var sec = (endTime - startTime) / 1000; 
        console.log("100MB received in "+sec+" seconds", ((bytesReceived / MB).toFixed(3) / sec) + " MB/sec");
      }
      else if(bytesReceived == 500*MB) {
        endTime = Date.now() 
        var sec = (endTime - startTime) / 1000; 
        console.log("500MB received in "+sec+" seconds", ((bytesReceived / MB).toFixed(3) / sec) + " MB/sec");
      }
      else if(bytesReceived == GB) {
        endTime = Date.now() 
        var sec = (endTime - startTime) / 1000; 
        console.log("1GB received in "+sec+" seconds", ((bytesReceived / GB).toFixed(3) / sec) + " GB/sec");
      }
    } 
    , null);
}


function ImageViewer(path){
  var html = '<img style="width:100%; height:100%;" src="/fs?action=send&id='+path+'"/>';
  var screenId = Id(NewScreen('<span class="glyphicon glyphicon-picture" style="margin-right: 4px;"></span> Image Viewer'));
  $(screenId).find(".win-body").html(html);
  $(screenId).find('input.path').val(path);		
}

function startTime() {
  var today=new Date();
  $('#datetimepicker').data("DateTimePicker").date(today);
  var h=today.getHours();
  var m=today.getMinutes();
  var s=today.getSeconds();
  m = checkTime(m);
  s = checkTime(s);
  var ampm = h >= 12 ? 'pm' : 'am';
  var hr = (h%12==0) ? 12:(h%12);
  var hms = (hr+":"+m+":"+s+" "+ampm);
  var hm = (hr+":"+m+" "+ampm);
  $('#SystemClock .time').html(hm.toUpperCase());
  var t = setTimeout(function(){startTime()},500);
}

function checkTime(i) {
  if (i<10) {i = "0" + i};  // add zero in front of numbers < 10
  return i;
}

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//http://stackoverflow.com/questions/8309835/xml-code-code-folding-or-expand-collapse-functionality-using-codemirror/22179494#22179494
function foldByLevel(cm, level) {
  foldByNodeOrder(cm, 0);
  // initialize vars
  var cursor = cm.getCursor();
  cursor.ch = 0;
  cursor.line = 0;
  var range = cm.getViewport();
  foldByLevelRec(cm, cursor, range, level);
};

function foldByLevelRec(cm, cursor, range, level) {
  if (level > 0) {
    var searcher = cm.getSearchCursor("<", cursor, false);
    while (searcher.findNext() && searcher.pos.from.line < range.to) {
      // unfold the tag
      cm.foldCode(searcher.pos.from, null, "unfold");
      // move the cursor into the tag
      cursor = searcher.pos.from;
      cursor.ch = searcher.pos.from.ch + 1;
      // find the closing tag
      var match = CodeMirror.findMatchingTag(cm, cursor, range);
      if (match) {
        if (match.close) {
          // create the inner-range and jump the searcher after the ending tag
          var innerrange = { from: range.from, to: range.to };
          innerrange.from = cursor.line + 1;
          innerrange.to = match.close.to.line;
          // the recursive call
          foldByLevelRec(cm, cursor, innerrange, level - 1);
        }
        // move to the next element in the same tag of this function scope
        var nextcursor = { line: cursor.line, to: cursor.ch };
        if (match.close) {
          nextcursor.line = match.close.to.line;
        }
        nextcursor.ch = 0;
        nextcursor.line = nextcursor.line + 1;
        searcher = cm.getSearchCursor("<", nextcursor, false);
      }
    }
  }
}

function foldByNodeOrder(cm, node) {
  // 0 - fold all
  unfoldAll(cm);
  node++;
  for (var l = cm.firstLine() ; l <= cm.lastLine() ; ++l)
    if (node == 0)
      cm.foldCode({ line: l, ch: 0 }, null, "fold");
    else node--;
}

function unfoldAll(cm) {
  for (var i = 0; i < cm.lineCount() ; i++) {
    cm.foldCode({ line: i, ch: 0 }, null, "unfold");
  }
}

function foldAll(cm) {
  for (var i = 0; i < cm.lineCount() ; i++) {
    cm.foldCode({ line: i, ch: 0 }, null, "fold");
  }
}

function test_procedure(){
  var t = new DbTransaction("","");
  t.table('app').join('left', ['app.date_created, app_call.date_created'], [{table:'app_call', on:'app.id = app_call.app_id'}]);
  t.table('app').select(["*"]);
  t.table('app').insert({name:"hello",desc:'wtf'});
  db_procedure(t, function(response){
    if(response.error) 
      console.log('error', response);
    else {
      var queryResponse = response.result;
      var cols = response.columns;
      for(var i in queryResponse){
        var queryResult = queryResponse[i];
        var queryColumns = response.columns[i];
        var isArray = (queryResult instanceof Array);
        if(isArray) { //select or join
          for(var j in queryResult){
            var str = "";
            var row = queryResult[i];
            for(var k in queryColumns){
              var colName = queryColumns[k].name; 
              str += " " + colName + ":" + row[colName] + "\n";
            }
            console.log(str);
          }
        } 
        else { //insert, delete, or update
          console.log(queryResult);
        }
      }
    }
  }); 
}

function db_procedure(transaction, complete){
  var json = (JSON.stringify(transaction.toJSON()));
  $.get('/nosql', { t: json }, function(response){
    if(complete) complete(response);
  });
}

function DbTransaction(server, db, ops){
  var server 	= server ? server : "";
  var db 		= db 	 ? db	  : "";
  var table		= table	 ? table  : "";
  var ops 		= ops 	 ? ops    : [];
  var dbTransaction = {
    server: server,
    database: db,
    //table: table,
    operation: ops /*[
       {
       	 table: "mytable",
         method:"select", 
         columns : ["*", "col1", "col2"],
         where: "",
         orderby: ""
       },
       {
       	 table: "mytable",
         method:"insert", 
         values: [{ col1: "col1", col2: "col2" }]
       },
       {
         table: "mytable",
         method:"update", 
         values: [{ col1: "col1", col2: "col2" }],
         where: ""
       },
       {
         table: "mytable",
         method:"delete",
         where: ""
       },
       {
         method:"join",
         table:{
           name: "mytable"
           columns : ["*", "col1", "col2"],
           where: "",
           orderby: ""
         },
         join:[{table:"", on: ""}]
       }
     ]*/
  };

  this.table = function(name){
  	table = name;
    return this;
  }
  
  this.getProcedures = function(){
  	 var proc = null;
    dbTransaction.operation.push(proc={"table":table, "method":"sql", "value": "SHOW PROCEDURES STATUS" });
    return proc;
  }
  
  this.getFunctions = function(){
  	 var proc = null;
    dbTransaction.operation.push(proc={"table":table, "method":"sql", "value": "SHOW PROCEDURES STATUS" });
    return proc;
  }
  
  this.insert = function(values) { 
    var insert = null;
    dbTransaction.operation.push(insert={"table":table, "method":"insert", "values": values });
    return insert;
  };

  this.select = function(cols, where, orderby){
    var select=null;
    var cols = cols ? cols : [];
    var where = where ? where: "";
    var orderby = orderby ? orderby: "";
    dbTransaction.operation.push(select={"table":table, method:"select", columns: cols, where: where, orderby: orderby });
    return select;
  };

  this.update = function(values, where){
    var update = null;
    var where = where ? where: "";
    dbTransaction.operation.push(update={"table":table, method:"update", values: values, where:where });
    return update;
  };

  this.delete = function(where){
    var del = null;
    dbTransaction.operation.push(del={"table":table, method:"delete", where: where });
    return del;
  };

  this.join   = function(type, cols, join, where, orderby){
    var type    = type    ? type    : "inner";
    var cols    = cols    ? cols    : [];
    var where   = where   ? where   : "";
    var orderby = orderby ? orderby : "";
    var join  = join  ? join  : [];

    var joinObj = {
      method : type,
      table : {
        "name": table,
        "columns" : cols,
        "where": where,
        "orderby": orderby
      },
      join: join,

    };
    dbTransaction.operation.push(joinObj);
    return joinObj;
  };

  this.toJSON = function(){
    return dbTransaction;
  };

  function quote(str){
    return "'"+str+"'";
  };
  
  function tick(str){
   	return '`'+str+'`'; 
  }

  this.toSQL = function() {
    var sql = [];
    var ops = dbTransaction.operation;
    //var dbTable = dbTransaction.table;
    for(var i in ops){
      switch(ops[i].method.toLowerCase()){
        case "select":
          sql.push(("SELECT " + ops[i].columns.join(',') + " FROM " + ops[i].table + " " + ops[i].where + " " + ops[i].orderby).trim() + ";");
          break;
        case "update":
          var setValues = "";
          for(var name in ops[i].values){
            setValues += name + " = " + quote(ops[i].values[name]) + ", ";
          }
          setValues = setValues.substring(0, setValues.lastIndexOf(','));
          sql.push(("UPDATE " + ops[i].table + " SET " + setValues + " " + ops[i].where).trim() + ";");
          break;
          case "insert":
          var setNames = "";
          var setValues = "";
          for(var name in ops[i].values){
            setNames += tick(name) + ", ";
            setValues += quote(ops[i].values[name]) + ", ";
          }
          setValues = setValues.substring(0, setValues.lastIndexOf(','));
          setNames  = setNames.substring(0, setNames.lastIndexOf(','));
          sql.push( ("INSERT INTO " + tick(ops[i].table) + " (" + setNames + ") VALUES (" + setValues+")").trim() + ";");
          break;
       
        case "delete":
          sql.push( ("DELETE FROM " + ops[i].table + " " + ops[i].where).trim() + ";");
          break;
        case "inner":
          var join = "";
          for(var index in ops[i].join){
            join += "INNER JOIN " + ops[i].join[index].table + " ON " + ops[i].join[index].on + " ";
          }
          join = join.trim();
          sql.push(("SELECT " + ops[i].table.columns.join(',') + " FROM " + ops[i].table.name + " "+ join + " " + ops[i].table.where + " " + ops[i].table.orderby).trim() + ";");
          break;
        case "left":
          var join = "";
          for(var index in ops[i].join){
            join += "LEFT JOIN " + ops[i].join[index].table + " ON " + ops[i].join[index].on + " ";
          }
          join = join.trim();
          sql.push(("SELECT " + ops[i].table.columns.join(',') + " FROM " + ops[i].table.name + " "+ join + " " + ops[i].table.where + " " + ops[i].table.orderby).trim() + ";");
          break;
        case "right":
          var join = "";
          for(var index in ops[i].join){
            join += "RIGHT JOIN " + ops[i].join[index].table + " ON " + ops[i].join[index].on + " ";
          }
          join = join.trim();
          sql.push(("SELECT " + ops[i].table.columns.join(',') + " FROM " + ops[i].table.name + " "+ join + " " + ops[i].table.where + " " + ops[i].table.orderby).trim() + ";");
          break;
      }
    }
    return sql;
  };
}

$(document).ready(function(){
 
  
  $('#Desktop').click(function(){
    $('#StartMenu').fadeOut();
    $('.calendar').fadeOut();
  }).hide()
    .css('background-image',"url('images/engine-wallpaper-24.jpg')")
  	.fadeIn(2500);

  //var doorbell = new Audio('http://stacknext.com/audio/138099__snakebarney__car-start.mp3');
  //doorbell.play();
  //var introSound = new Audio('http://stacknext.com/audio/38293__vann-westfold__horns1.wav');
  //introSound.play();
  
  $("#StartButton").click(function(e){
    $("#StartMenu").fadeToggle();
  });
  $('#SystemClock .time').click(function(){
    $('#SystemClock .calendar').toggle();
  })
 
  /*
  $('#datetimepicker').datetimepicker({
    inline: true,
    sideBySide: true
  });
  */
  
  $('#StartMenu').resizable({handles: 'e'});
  
  /*
  $('#Desktop').contextmenu({
    target: '#context-menu',
    before: function(e,context) {
   		// execute code before context menu if shown
     	console.log(e.target.id, $(e.target).closest('.window'));
  	},
    onItem: function (context, e) {
      var target = $(e.target);
    }
  });
  */
  //startTime();
   $('#invoke-task-manager').click(function(){
    InvokeTaskManager();
    $("#StartMenu").fadeOut();
  }).hover(
    function(){
   		$(this).css({
          'border-left':'solid 3px #23a1e6',
          'color':'#23a1e6'
        });
    },
    function(){
      $(this).css({
        'border-left':'solid 3px #eee',
        'color':'#fff'
      });
  });
  $('#invoke-file-explorer').click(function(){
    InvokeFileExplorer();
    $("#StartMenu").fadeOut();
  }).hover(
    function(){
   		$(this).css({
          'border-left':'solid 3px #23a1e6',
          'color':'#23a1e6'
        });
    },
    function(){
      $(this).css({
        'border-left':'solid 3px #eee',
        'color':'#fff'
      });
  });
  $('#invoke-system').click(function(){
    InvokeSystem();
    $("#StartMenu").fadeOut();
  }).hover(
    function(){
   		$(this).css({
          'border-left':'solid 3px #23a1e6',
          'color':'#23a1e6'
        });
    },
    function(){
      $(this).css({
        'border-left':'solid 3px #eee',
        'color':'#fff'
      });
  });
  $('#invoke-settings').click(function(){
    InvokeSettings();
    $("#StartMenu").fadeOut();
  }).hover(
    function(){
   		$(this).css({
          'border-left':'solid 3px #23a1e6',
          'color':'#23a1e6'
        });
    },
    function(){
      $(this).css({
        'border-left':'solid 3px #eee',
        'color':'#fff'
      });
  });
  $('#invoke-power').click(function(){
    $("#StartMenu").fadeOut();
  }).hover(
    function(){
   		$(this).css({
          'border-left':'solid 3px #23a1e6',
          'color':'#23a1e6'
        });
    },
    function(){
      $(this).css({
        'border-left':'solid 3px #eee',
        'color':'#fff'
      });
  });
  $('#invoke-myaccount').click(function(){
    InvokeMyAccount();
    $("#StartMenu").fadeOut();
  }).hover(
    function(){
   		$(this).css({
          'border-left':'solid 3px #23a1e6',
          'color':'#23a1e6'
        });
    },
    function(){
      $(this).css({
        'border-left':'solid 3px #eee',
        'color':'#fff'
      });
  });
  $('#invoke-editor').click(function(){
    InvokeEditor();
    $("#StartMenu").fadeOut();
  }).hover(
    function(){
   		$(this).css({
          'border-left':'solid 3px #23a1e6',
          'color':'#23a1e6'
        });
    },
    function(){
      $(this).css({
        'border-left':'solid 3px #eee',
        'color':'#fff'
      });
  });
  $('#invoke-calendar').click(function(){
    InvokeCalendar();
    $("#StartMenu").fadeOut();
  }).hover(
    function(){
   		$(this).css({
          'border-left':'solid 3px #23a1e6',
          'color':'#23a1e6'
        });
    },
    function(){
      $(this).css({
        'border-left':'solid 3px #eee',
        'color':'#fff'
      });
  });
  $('#invoke-browse').click(function(){
   InvokeBrowse();
    $("#StartMenu").fadeOut();
  }).hover(
    function(){
   		$(this).css({
          'border-left':'solid 3px #23a1e6',
          'color':'#23a1e6'
        });
    },
    function(){
      $(this).css({
        'border-left':'solid 3px #eee',
        'color':'#fff'
      });
  });
  $('#invoke-terminal').click(function(){
   InvokeTerminal();
    $("#StartMenu").fadeOut();
  }).hover(
    function(){
   		$(this).css({
          'border-left':'solid 3px #23a1e6',
          'color':'#23a1e6'
        });
    },
    function(){
      $(this).css({
        'border-left':'solid 3px #eee',
        'color':'#fff'
      });
  });
  AppWebSocket = CommandProcessor();
  //InvokeFileExplorer();
  
  $('#Taskbar').show();
  //InvokeMain();
  //AppWebSocket.send(JSON.stringify([{cmd:'properties', path:'/'}]));
  InvokeFileExplorer();
  //$('#app-modal').modal('hide');

  
  SystemCalendar = new SysCalendar();
   
});


