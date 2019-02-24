angular.module('todoApp', [])
  .controller('TodoListController', function($scope) {
  var todoList = this;

  let reloadTodo = function(){
    $.getJSON('/todo?get=true', function(data){ 
      $scope.$apply(function(){
        todoList.todos = data;
      });
    });
  }

  reloadTodo();

  todoList.addTodo = function() {
    $.getJSON('/todo?add=true', { item: (new Date).toDateString()  + " - " + todoList.todoText }, function(data){ 
      $scope.$apply(function(){
        todoList.todos = data;
        todoList.todoText = '';

      });
    });
  };
  
  let updateTodoStaus = function(id, done, callback) {
    $.getJSON('/todo?update=true', { index: id, done: done }, function(data){ 
      callback();
    });
  };

  let deleteTodo = function(id, callback) {
    $.getJSON('/todo?delete=true', { index: id }, function(data){ 
      callback();
    });
  };

  todoList.selectAll = function(){
    let list = window.document.querySelectorAll('input[type=checkbox]')
    for(let i in list){
      let elem = list[i];
      if(elem.constructor && elem.constructor.name != 'HTMLInputElement') continue;
      elem.checked = true;
    }
  }
  
  todoList.selectNone = function(){
    let list = window.document.querySelectorAll('input[type=checkbox]')
    for(let i in list){
      let elem = list[i];
      if(elem.constructor && elem.constructor.name != 'HTMLInputElement') continue;
      elem.checked = false;
    }
  }
  
  todoList.done = function(){
    let list = window.document.querySelectorAll('input[type=checkbox]')
    let checked = [].filter.call( list, function( el ) {
      return el.checked;
    });
    let ids = [];
    checked.forEach(function(cb){ 
      ids.push(cb.id);
    });
	let done = true;
    updateTodoStaus(JSON.stringify(ids), done, function(){ 
      reloadTodo();
    });
  }
  
  todoList.notDone = function(){
    let list = window.document.querySelectorAll('input[type=checkbox]')
    let checked = [].filter.call( list, function( el ) {
      return el.checked;
    });
    let ids = [];
    checked.forEach(function(cb){ 
      ids.push(cb.id);
    });
	let done = false;
    updateTodoStaus(JSON.stringify(ids), done, function(){ 
      reloadTodo();
    });
  }
  
  
  todoList.delete = function(){
    let list = window.document.querySelectorAll('input[type=checkbox]')
    let checked = [].filter.call( list, function( el ) {
      return el.checked;
    });
    
    let sure = confirm('Are you sure you want to delete ' + checked.length + " items?");
    if(sure){
      let ids = [];
      checked.forEach(function(cb){ 
        ids.push(cb.id);
      });
      deleteTodo(JSON.stringify(ids), function(){ 
        reloadTodo();
      });
    }
  }

  todoList.remaining = function() {
    var count = 0;
    angular.forEach(todoList.todos, function(todo) {
      count += todo.done ? 0 : 1;
    });
    return count;
  };

  todoList.archive = function() {
    var oldTodos = todoList.todos;
    todoList.todos = [];
    angular.forEach(oldTodos, function(todo) {
      if (!todo.done) todoList.todos.push(todo);
    });
  };
});



