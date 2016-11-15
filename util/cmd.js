/**
 * Module dependencies.
 */ 
var exec = require('child_process').exec;

var config=require('../config/config');
var result=require('../util/utils').result;
 

/**
 * Expose
 */
cmdController={
    pull:function(repoDir,branch,cb){  
        exec("git checkout "+branch,{cwd: repoDir}, function(err, stdout, stderr) {
            if(!err){
                exec("git pull origin "+branch,{cwd: repoDir}, function(err, stdout, stderr) {
                    if(!err){
                        cb(result(0,'',stdout));
                    }else{
                        console.log(stderr);
                        cb(result(1,'git pull error',stderr));
                    } 
                }) 
            }else{
                cb(result(1,'git checkout error',stderr)); 
            } 
        }) 
    },
    clean:function(repoDir,cb){
        exec("git clean -fd ",{cwd: repoDir}, function(err, stdout, stderr) {
            if(!err){
                cb(result(0,'',stdout));
            }else{
                console.log(stderr);
                cb(result(1,'git clean error',stderr));
            } 
        }) 
    },
    status:function(repoDir,cb){
        exec("git status",{cwd: repoDir}, function(err, stdout, stderr) {
            if(!err){
                cb(result(0,'',stdout));
            }else{
                console.log(stderr);
                cb(result(1,'git status error',stderr));
            } 
        })
    }
}

module.exports = cmdController;