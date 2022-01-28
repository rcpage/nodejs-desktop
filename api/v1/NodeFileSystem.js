
class NodeFileSystem extends Microservice {

  static get pathMod() {
    return System.getModule('path');
  }

  static get mime() {
    return System.getModule('mime');
  }

  static get fs() {
    return System.getModule('fs');
  }

  static get path() {
    return "/nodeFileSystem";
  }

  static GET() {
    let path = this.req.query.path;
    this.res.setHeader('Access-Control-Allow-Origin', '*');
    this.res.json(this.getFilesAndDirectories(path));
  }

  static GET2() {
    let path = this.req.query.path;
    this.fs.readdir(path, (err, files) => {
      if (err) {
        this.res.json(err);
        return;
      }
      this.res.json(files);
    });
  }

  static getStats(filename) {
    var stats = this.fs.statSync(filename)
    return stats;
  }

  static getFilesAndDirectories(srcpath) {
    var files = this.getFiles(srcpath);
    var dirs = this.getDirectories(srcpath);
    return dirs.concat(files);
  }

  static getFiles(srcpath) {
    var list = [];
    var files = this.fs.readdirSync(srcpath).filter((file) => {
      var stats = this.fs.statSync(this.pathMod.join(srcpath, file));
      return stats.isFile();
    });
    for (var i in files) {

      list.push({
        path: files[i]
        , isDirectory: false
        , isFile: true
        , ContentType: this.mime.getType(files[i])
        , stats: this.getStats(srcpath + "/" + files[i])
      });
    }
    return list;
  }
  static getDirectories(srcpath) {
    var list = [];
    var files = this.fs.readdirSync(srcpath).filter((file) => {
      return this.fs.statSync(this.pathMod.join(srcpath, file)).isDirectory();
    });
    for (var i in files) {
      list.push({
        path: files[i]
        , isDirectory: true
        , isFile: false
        , ContentType: 'folder'
        , stats: this.getStats(srcpath + "/" + files[i])
      });
    }
    return list;
  }


  static explore(path) {
    try {
      var stats = this.fs.statSync(path);
      if (stats.isDirectory()) {
        return JSON.stringify(this.getFilesAndDirectories(path));
      }
    } catch (e) {
      console.error(e);
    }
  }
}
