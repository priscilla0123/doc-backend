/**
 * Module dependencies.
 */
var fs = require("fs"); 
var recursive = require('recursive-readdir');
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
                //buf = new Buffer(stats.size);

                fs.readFile(path,'utf8',function(err,data){
                    if (err) {
                        next(resultModule(11, err));
                        return;
                    } 
                    next(resultModule(0, '', data));
                     
                })

                // fs.open(path, 'r', function(err, fd) {
                //     if (err) {
                //         next(resultModule(11, err));
                //         return;
                //     }

                //     fs.readFile(path,'utf8',function(err,data){
                //         console.log('data');
                //         console.log(data);
                //     })
                //     fs.read(fd, buf, 0, buf.length, 0, function(err, bytes) {
                //         if (err) {
                //             next(resultModule(111, err));
                //             return;
                //         }
                //         // 仅输出读取的字节
                //         if (bytes > 0) {
                //             next(resultModule(0, '', buf.slice(0, bytes).toString()));
                //         }

                //         // 关闭文件
                //         fs.close(fd, function(err) { 
                //         });
                //     });
                // });
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
    getChildren: function(path, recursive,next,ignoreReg) { 
        var _this=this;
        var FileList = [];
        if (recursive) {
            //todo
        } else { 
            fs.readdir(path, function(err, files) {
                if (err) {
                    next(resultModule(1, err));
                    return;
                }
                files.forEach( function (file){  
                    if(ignoreReg&&ignoreReg.test(file)){
                        return;
                    }
                    var File=_this.readInfoSync((path+'/'+file).replace(/\/\//g,'/'));
                    File.name=file;
                    FileList.push(File); 
                });  
                next(resultModule(0,'', FileList));
            });
        } 
    }, 
    getChildFolders: function(path,recursive,next,ignoreReg) { 
        var folers=[]; 
        this.getChildren(path,recursive,function(result){
            if(result.code==0){
                result.data.forEach(function(item,i){
                    if(item.type=='dir'){
                        folers.push(item);
                    }
                })
                next(resultModule(0,'',folers));
            }
            else{
                next(resultModule(1,result.msg));
            }

        },ignoreReg)
    },
    countsubFile:function(path,next){
        recursive(path, function (err, files) { 
            if(err){
                next(resultModule(1,err));
            }else{
                next(resultModule(0,"",files.length));
            } 
        });
    } ,
    countsubFolder:function(path){
        var count=0;
        var files=fs.readdirSync(path); 
        if(files.length){
            files.forEach( function (file){ 
                var File=fileController.readInfoSync((path+'/'+file).replace(/\/\//g,'/'));
                if(File.type=='dir'){
                    count++;
                    var sub=fileController.countsubFolder(File.path);
                    if(sub>0){count +=sub;}  
                }
            });  
            return count; 
        }
        else{
            return 0;
        } 
         
    }
}

module.exports = fileController;
