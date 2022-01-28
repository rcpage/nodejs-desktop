var app = angular.module('App', []);
app.config(['$compileProvider', function ($compileProvider) {
  // disable debug info
  //$compileProvider.debugInfoEnabled(false);
}]);

class TaskWindow {
  constructor(id, title, content, display) {
    this.id = id;
    this.title = title;
    this.display = display || 'none';
    this.content = content;
  }
}

class TaskMenu {
  constructor(id, title, windows, style) {
    this.id = id;
    this.title = title;
    this.windows = windows || [];
    this.style = style || {
      left: 0
    }
  }

  addWindow(id, title, url, display) {
    var content = '<iframe frameborder="0" width="100%" height="100%" src="' + url + '"></iframe>';
    this.windows.push(new TaskWindow(id, title, content, display));
    return this;
  }
}

function SysCalendar() {
  var clockInterval = null;
  var selectedDate = new Date(Today().toString);

  var selectedYear = 0;
  var selectedMonth = 0;
  var selectedDay = 0;

  function init(defaultYear, defaultMonth, defaultDay) {
    var calendarWidthConst = 314;
    var monthIndex = defaultMonth ? defaultMonth : 0;//0=jan,feb=1,..,10=nov,11=dec
    var selectedDay = defaultDay ? defaultDay : null;

    $('.calendar', '#SystemClock').html(BuildCalendarHTML(defaultYear));

    //get ui-button elements
    var monthSelection = $('.calendar-year .month-selection', '#SystemClock');
    var months = $('.calendar-year .months', '#SystemClock');
    var monthYr = $('.calendar-year .month-year', '#SystemClock');
    var monthYrUp = $('.calendar-year .month-year-up', '#SystemClock');
    var monthYrDown = $('.calendar-year .month-year-down', '#SystemClock');
    var todaysDate = $('.calendar-year .datetime .date', '#SystemClock');
    var todayElement = $('.calendar-year .today', '#SystemClock');
    var dateElement = $('.calendar-year .day', '#SystemClock');
    var monthElement = $('.calendar-year .month-option', '#SystemClock');

    function updateDate() {
      $('.date', '#SystemClock').html('<a href="#" onclick="return false;">' + Today().toString + '</a>');
    }

    function updateTime() {
      $('.time', '#SystemClock').html(Today().timeDetail.toUpperCase());
    }

    function updateDateTime() {
      updateDate();
      updateTime();
    }

    function clearSelectedDay() {
      $('.calendar-year .day', '#SystemClock').removeClass('day-selected');
      selectedDate = new Date(Today().toString);

      selectedYear = 0;
      selectedMonth = 0;
      selectedDate = 0;
    }

    function showMonth(index) {
      months.css('margin-left', (-calendarWidthConst * index) + "px");
    }

    function selectDay(month, day) {
      clearSelectedDay();
      $('.calendar-year .month', '#SystemClock')
        .eq(month)
        .find('.day')
        .filter(function (i) { return $(this).text() == day + "" })
        .addClass('day-selected');
    }

    function showTodaysMonth() {
      monthIndex = Today().month - 1;
      setYear(Today().year, monthIndex, Today().day);
    }

    //define click event handlers
    var monthYrClick = function (e) {
      monthSelection.show();
      months.hide();
      monthSelection.children().removeClass('selected-month').filter(function (i) {
        return $(this).index() == monthIndex + 1;
      }).addClass('selected-month');
    };

    var monthYrUpClick = function (e) {
      if (monthIndex - 1 >= 0) {
        monthIndex--;
      } else {
        monthIndex = 11;
        setYear(defaultYear - 1, monthIndex);
      }
      showMonth(monthIndex);
    };

    var monthYrDownClick = function (e) {
      if (monthIndex + 1 <= 11) {
        monthIndex++;
      } else {
        monthIndex = 0;
        setYear(defaultYear + 1, monthIndex);
      }
      showMonth(monthIndex);
    };

    var todaysDateClick = function (e) {
      clearSelectedDay();
      selectedDate = new Date(Today().toString);
      showTodaysMonth();
    };

    var dateElementClick = function (e) {
      clearSelectedDay();
      selectedDate = new Date($(this).attr('date'));

      selectedYear = selectedDate.getFullYear();
      selectedMonth = selectedDate.getMonth();
      selectedDate = selectedDate.getDate();

      $(this).addClass('day-selected');
    };

    var monthElementClick = function (e) {
      monthSelection.hide();
      months.show();
      showMonth(monthIndex = $(this).index() - 1);
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
    if (selectedDay) {
      selectDay(monthIndex, selectedDay);
    }
    updateDateTime();

    //return interval object so it may be disposed
    return setInterval(function () {
      updateTime();
    }, 1000);
  }

  function dispose(interval) {
    if (interval) clearInterval(interval);
    $('.calendar', '#SystemClock').empty();
  }

  function setYear(year, month, day) {
    dispose(clockInterval);
    clockInterval = init(year, month, day);
  }
  //Clock Interval
  clockInterval = init(Today().year, Today().month - 1, Today().day);
}

function BuildCalendarHTML(year) {
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
  html += '			<span class="month-year">' + year + '</span>';
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

  for (var month in ThisYear) {
    html += '<div class="month">';
    html += '<div class="month-title">';
    html += '	<div style="float:right;">';
    html += '		<i class="month-year-up glyphicon glyphicon-chevron-up" />';
    html += '		<i class="month-year-down glyphicon glyphicon-chevron-down" />';
    html += '	</div>';
    html += '	<span class="month-year">' + month + ' ' + year + '</span>';
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
    for (var i = 0; i < ThisYear[month].length; i++) {
      var date = ThisYear[month][i];
      //add weekday padding until first of month
      if (date.getDate() == 1) {
        for (var j = 0; j < date.getDay(); j++) {
          html += '<span class="day" style="border: solid 1px transparent;">&nbsp;</span>';
        }
      }
      var isDateToday = Today().year == date.getFullYear()
        && Today().monthName == month
        && Today().day == date.getDate();
      if (isDateToday) {
        html += '<span class="day today" date="' + date.toString() + '">' + date.getDate() + '</span>';
      }
      else {
        html += '<span class="day" date="' + date.toString() + '">' + date.getDate() + '</span>';
      }
    }
    html += '</div>';
    html += '</div>';
  }
  html += '</div>';
  html += '<div class="schedule-task">';
  html += '		<a href="#" onclick="return false;">Schedule Task or Event</a>';
  html += '</div>';
  html += '</div>';
  return html;
}

function Calendar(year) {
  var weeks = getWeeksInYear(year);
  var Calendar = {
    January: []
    , February: []
    , March: []
    , April: []
    , May: []
    , June: []
    , July: []
    , August: []
    , September: []
    , October: []
    , November: []
    , December: []
  };
  for (var i in weeks) {
    var week = weeks[i];
    for (var day in week) {
      var date = week[day];
      if (date) {
        var monthFullName = getMonthYearMap()[date.getMonth()];
        var monthAbbvr = monthFullName;
        Calendar[monthAbbvr].push(date);
      }
    }
  }
  return Calendar;
}

function isWeekEmpty(week) {
  for (var weekday in week) {
    if (week[weekday] != null) return false;
  }
  return true;
}

function getWeeksInYear(yr) {
  var weekday = getWeekdayMap();
  var weeksInYear = [];
  var year = getCalendarYear(yr);
  var totalDays = 0;
  for (var month in year) {
    var days = year[month];
    var week = getWeek();
    for (var day in days) {
      totalDays++;
      var time = days[day];
      if (time.weekday == "Sunday") {
        if (!isWeekEmpty(week)) weeksInYear.push(week);
        week = getWeek();
      }
      week[time.weekday.substr(0, 2)] = time.date;
    }
    if (!isWeekEmpty(week)) weeksInYear.push(week);
  }
  return weeksInYear;
}

function printDaysInMonth(year) {
  var year = getCalendarYear(year);
  for (var m in year) {
    var month = year[m];
    for (var d in month) {
      var day = month[d];
      console.log(day.weekday + ", " + day.monthFullName + " " + day.day + ", " + day.year);
    }
  }
}

function getWeekdayMap() {
  var weekday = new Array(7);
  weekday[0] = "Sunday";
  weekday[1] = "Monday";
  weekday[2] = "Tuesday";
  weekday[3] = "Wednesday";
  weekday[4] = "Thursday";
  weekday[5] = "Friday";
  weekday[6] = "Saturday";
  return weekday;
}

function getMonthYearMap() {
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

function getCalendarYear(year) {
  var calendarYear = {};
  var days = getDaysInMonth(year);
  for (var monthFullName in days) {
    calendarYear[monthFullName] = {};
    for (var day = 1; day <= days[monthFullName]; day++) {
      var date = new Date(monthFullName + " " + day + ", " + year);
      var weekday = getWeekdayMap();
      calendarYear[monthFullName][day] = {
        year: year
        , month: date.getMonth() + 1
        , monthFullName: monthFullName
        , day: day
        , weekday: weekday[date.getDay()]
        , date: date
      };
    }
  }
  return calendarYear;
}

function getDaysInMonth(year) {
  var m = getMonthYearMap();
  var months = {};
  for (var month = 1; month <= 12; month++) {
    months[m[month - 1]] = Date.daysInMonth(year, month);
  }
  return months;
}

Date.daysInMonth = function (year, month) {
  //Day 0 is the last day in the previous month  
  return new Date(year, month, 0).getDate();
}

function Today() {
  var today = new Date();
  var d = today.getDate();
  //January is 0!
  var m = today.getMonth() + 1;
  var yyyy = today.getFullYear();
  var dd = d < 10 ? "0" + d : "" + d;
  var mm = m < 10 ? "0" + m : "" + m;

  var h = today.getHours();
  var min = today.getMinutes();
  var sec = today.getSeconds();
  min = checkTime(min);
  sec = checkTime(sec);
  var ampm = h >= 12 ? 'pm' : 'am';
  var hr = (h % 12 == 0) ? 12 : (h % 12);
  var hms = (hr + ":" + min + ":" + sec + " " + ampm);
  var hm = (hr + ":" + min + " " + ampm);

  var weekday = getWeekdayMap()[today.getDay()]
  var monthName = getMonthYearMap()[today.getMonth()]
  return {
    date: today
    , day: d
    , month: m
    , monthName: monthName
    , year: yyyy
    , weekday: weekday
    , summary: mm + '/' + dd + '/' + yyyy
    , time: hm
    , timeDetail: hms
    , toString: weekday + ", " + monthName + " " + dd + ", " + yyyy
  }
}

function getWeek() {
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

function checkTime(i) {
  if (i < 10) { i = "0" + i };  // add zero in front of numbers < 10
  return i;
}


function hideTaskWindows() {
  var taskWindows = document.querySelectorAll('.task-windows');
  taskWindows.forEach(win => {
    win.parentElement.style.display = 'none';
  });
}
function onToggleTasks(tab) {
  var elem = document.querySelector('[for="' + tab.id + '"]');

  if (elem.style.display == 'none') {
    hideTaskWindows();
    elem.style.display = "block";
  }
  else
    elem.style.display = 'none';
}

function toggleStartMenu() {
  var startMenu = document.querySelector('#StartMenu');
  if (startMenu.style.display == 'none') {
    startMenu.style.display = 'block';
  }
  else {
    startMenu.style.display = 'none';
  }
}

function toggleClock() {
  var startMenu = document.querySelector('.calendar');
  if (startMenu.style.display == 'none') {
    startMenu.style.display = 'block';
  }
  else {
    startMenu.style.display = 'none';
  }
}

function positionTaskMenus($scope) {
  /* 
    ** important!! Need to render html before calling 
    ** document.querySelectorAll('#FrameTabs div.app-tasks')
    */
  $scope.$apply();
  //calc tab styles
  var divs = document.querySelectorAll('#FrameTabs div.app-tasks');
  for (let i in $scope.Tasks) {
    console.log(divs[i]);
    var marginLeft = Number(document.querySelector('#' + divs[i].id).style.marginLeft.replace('px', ''));
    var value = divs[i].offsetLeft + marginLeft;
    //console.log(divs[i].id, value, '#'+divs[i].id);
    $scope.Tasks[i].style.left = value;
  }
  $scope.$apply();
}

function addTask($scope, taskId, title, content) {
  var taskList = $scope.Tasks,
    taskFound = false,
    newTask = new TaskWindow($scope.getNewWindowId(), title, content);
  for (var i in taskList) {
    var task = taskList[i];
    if (task.id == taskId) {
      taskFound = true;
      task.windows.push(newTask);
      $scope.$apply();
      console.log('new task added...', newTask);
    }
  }
  if (!taskFound) {
    taskList.push(new TaskMenu(taskId, title, [newTask]));
    positionTaskMenus($scope);
    console.log('new task added...', newTask);
  }

}

app.filter('trustAsHtml', ['$sce', function ($sce) {
  return function (text) {
    return $sce.trustAsHtml(text);
  };
}]);

app.controller('DesktopController', function ($scope) {
  $scope._windowCount = 6;
  $scope.getNewWindowId = function () {
    return $scope._windowCount++;
  }
  $scope.Tasks = [
    (new TaskMenu(1, 'File Navigator')).addWindow(1, 'File Navigator', 'http://localhost:8091/angular/controller/file-system.html'),
    (new TaskMenu(2, 'Text Editor')).addWindow(2, 'Test Editor', 'http://localhost:8091/angular/controller/text-editor.html?id=5c2d3cc8b8b96f59fcc331dd&source=/home/vagrant/stack/www/angular/controller/desktop/index.html&mode=htmlmixed'),
    (new TaskMenu(3, 'Fedora Workstation')).addWindow(3, 'Fedora Workstation', 'http://localhost:9090/')
  ];

  $scope.addTask = function (id, title, content) {
    addTask($scope, id, title, content);
  }

  angular.element(document.body).ready(function () {
    positionTaskMenus($scope);
    new SysCalendar();
  });

  $scope.taskClick = function (task) {
    console.log(task.window);
    var tasks = $scope.Tasks;
    for (var i in tasks) {
      for (var j in tasks[i].windows) {
        var taskWin = tasks[i].windows[j];
        taskWin.display = 'none';
        if (taskWin.id == task.window.id) {
          taskWin.display = 'block';
        }
      }
    }
  }
});

