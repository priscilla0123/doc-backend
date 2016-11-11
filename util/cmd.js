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
        console.log(repoDir);
        exec("git checkout "+branch,{cwd: repoDir}, function(err, stdout, stderr) {
            if(!err){
                exec("git pull",{cwd: repoDir}, function(err, stdout, stderr) {
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
    }
}

module.exports = cmdController;