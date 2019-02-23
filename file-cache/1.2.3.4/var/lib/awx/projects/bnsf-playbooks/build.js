var args = process.argv.slice(2);
var fs = require('fs');
var jsyaml = require('js-yaml');
var projectDir = 'playbooks/ELK Logging/';
var taskDir =  projectDir + 'tasks/';
const log = function(){ return console.log.apply(console, arguments); }


switch(args[0]){
  case "build":
    writePlaybook();
    log("Playbook has been written.");
    break;
  case "readme":
    writeREADME();
    log("README.md has been written.");
    break;
  case "yaml":
    log(buildPlaybookYAML());
    break;
  case "json":
    log(JSON.stringify(buildPlaybookJSON(), null, 2));
    break;
  default:
    log("Please enter command: build");
}


function readJSON(filename){
  try {
    return JSON.parse(fs.readFileSync(filename));
  }
  catch(e){
    return null;
  }
}

function buildTaskJSON(write){
  var filenames = [];
  var playbook = JSON.parse(fs.readFileSync('playbooks/ELK Logging/playbook.json').toString());
  playbook[0].tasks.forEach((task, i) => {
    var tags = task.tags ? task.tags.join(' ') : "";
    if(tags){
      var desc = tags[0].toUpperCase() + tags.substr(1);

      var filename1 = task.tags.join('-') + '.json';
      var filename2 = task.name.toLowerCase().replace(new RegExp(' ','g'),'_') + '.json';
      var filename3 = ("000" + i).substr(-3) + "-" + task.tags.join('-') + '.json';
      var body = JSON.stringify(task, null, 2); 
      if(write) fs.writeFileSync(taskDir + filename1, body);
      filenames.push(filename1);
      //console.log(filename1, task.name);
    }
  });
  var tasks = JSON.stringify(filenames, null, 2);
  console.log(tasks);
  fs.writeFileSync(projectDir + '../tasks.json', tasks);
}

//buildTaskJSON(true);

function buildPlaybookYAML(){
  var playbook = readJSON(projectDir  + 'playbook.json'),
      taskFiles = readJSON(projectDir + playbook.tasks),
      tasks = [],
      vars = readJSON(projectDir + playbook.vars);
  for(var i in taskFiles){
    var task = readJSON(taskDir + taskFiles[i]);
    if(task == null){
      log(taskFiles[i], task);
    } else {
      tasks.push(task);
    }
  }
  //replace filenames with js objects
  playbook.tasks = tasks;
  playbook.vars = vars;
  var playbookYAML = "---\n" + jsyaml.dump([ playbook ]);
  return playbookYAML;
}

function buildPlaybookJSON(){
  return jsyaml.load(buildPlaybookYAML());
}

function writePlaybook(){
  fs.writeFileSync(projectDir  + 'playbook.yml', buildPlaybookYAML());
}

function writeREADME(){
  fs.writeFileSync(projectDir + 'README.md', buildMarkup());
}

function buildMarkup(){
  var markup = '# Playbook Tasks\n\n';


  var playbook = readJSON(projectDir  + 'playbook.json'),
      taskFiles = readJSON(projectDir + playbook.tasks),
      tasks = [],
      vars = readJSON(projectDir + playbook.vars);


  markup += '```json\n';

  markup += JSON.stringify(playbook, null, 2);

  markup += '\n```\n';

  markup +=  '| Tasks | Tags |\n';
  markup += '| ----- | ---- |\n';

  for(var i in taskFiles){
    var filename = taskFiles[i];
    var path = taskDir + filename;
    var task = readJSON(path);
    if(task == null){
      log(taskFiles[i], task);
    } else {
      tasks.push(task);
      markup += '|['+task.name+'](tasks/'+filename+')|'+task.tags.join(', ')+'|\n';
    }
  }

  return markup;
}


