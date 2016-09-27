/**
 * Module dependencies.
 */
var fs = require("fs");
var resultModule = require('./utils').resultModule;

/**
 * Expose
 */
var fileController = {
    read: function(path, next) {
        fs.stat(path, function(err, stats) {
            if (err) {
                next(resultModule(1, err));
                return;
            }
            if (stats.isFile()) { 
                buf = new Buffer(stats.size);
                fs.open(path, 'r', function(err, fd) {
                    if (err) {
                        next(resultModule(11, err));
                        return;
                    }
                    fs.read(fd, buf, 0, buf.length, 0, function(err, bytes) {
                        if (err) {
                            next(resultModule(111, err));
                            return;
                        }
                        // 仅输出读取的字节
                        if (bytes > 0) {
                            next(resultModule(0, '', buf.slice(0, bytes).toString()));
                        }

                        // 关闭文件
                        fs.close(fd, function(err) { 
                        });
                    });
                });
            } else {
                next(resultModule(2, 'path is not a file')); 
            }
        });
    },
    readInfoSync:function(path){
        var stats=fs.statSync(path);
        if(stats.isFile()){
            return {path:path,type:'file'};
        }
        else{
            return {path:path,type:'dir'};
        } 
    },
    getChildren: function(path, recursive,next) { 
        var _this=this;
        var result = [];
        if (recursive) {
            //todo
        } else { 
            fs.readdir(path, function(err, files) {
                if (err) {
                    next(resultModule(1, err));
                    return;
                }
                files.forEach( function (file){ 
                    var temp=_this.readInfoSync(path+'/'+file);
                    temp.name=file;
                    result.push(temp); 
                }); 

                next(resultModule(0,'', result));
            });
        } 
    }
}

module.exports = fileController;
