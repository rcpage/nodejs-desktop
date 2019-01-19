var app = angular.module('App', []);
app.controller('DesktopController', function($scope) {
  
  $scope.Tasks = [
    {
      id: 123,
      title: 'Task #123',
      windows : [
        {
          id: '1',
          title: 'Task #123 - /path/to/some/file.js',
          display: 'none'
        },
        {
          id: '2',
          title: 'Task #123 - /path/to/some/other/file.js',
          display: 'none'
        },
      ]
    }
  ];
  
  $scope.Tasks2 = [
    { window_id:'123', title: 'Hello World!'},
    { window_id:'1234', title: 'Hello World2222!'}
  ];
  $scope.Windows = [
    { id:'123',  title: 'Hello World!', display: 'none'},
    { id:'1234',  title: 'Hello World2222!', display: 'none'}
  ];

  $scope.taskClick = function(task){
    console.log(task);
    for(var i in $scope.Windows){
      var taskWin = $scope.Windows[i];
      taskWin.display = 'none';
      if(taskWin.id == task.window_id){
        taskWin.display = 'block';
      }
    }
  }
});

