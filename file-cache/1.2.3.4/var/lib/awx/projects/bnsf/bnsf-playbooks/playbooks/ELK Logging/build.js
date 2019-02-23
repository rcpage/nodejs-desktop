var fs = require('fs'),
    tasks = JSON.parse(fs.readFileSync('tasks.json').toString());

for(var i in tasks){
  
    var filename = tasks[i],
        path = './tasks/' + filename,
        json = JSON.parse(fs.readFileSync(path).toString()),
        taskDefn = { filename: filename, task: json, path: path };
  //fs.writeFileSync(path, JSON.stringify(taskDefn, null, 2));
  tasks[i] = path;
}
fs.writeFileSync('tasks.json', JSON.stringify(tasks, null, 2))