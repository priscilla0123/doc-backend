/**
 * Module dependencies.
 */
var _fs = require("fs");
var exec = require('child_process').exec;

var config = require('../config/config');
var result = require('../util/utils').result;



/**
 * Expose
 */
cmdController = {
    pull: function(repoDir, branch, cb) {
        console.log('git pull start');
        var _this = this;
        _this.checkout(branch, repoDir, function(res) {
            if (!res.code) {
                exec("git pull origin " + branch, { cwd: repoDir }, function(err, stdout, stderr) {
                    if (!err) {
                        console.log('git pull end');
                        cb(result(0, '', stdout));
                    } else {
                        console.log('git pull error:' + stderr);
                        cb(result(1, 'git pull error', stderr));
                    }
                })
            } else {
                cb(result(1, 'git checkout error', res.data));
            }
        })
    },
    clean: function(repoDir, cb) {
        console.log('git clean start');
        exec("git clean -fd ", { cwd: repoDir }, function(err, stdout, stderr) {
            if (!err) {
                console.log('git clean end');
                cb(result(0, '', stdout));
            } else {
                console.log(stderr);
                cb(result(1, 'git clean error', stderr));
            }
        })
    },
    status: function(repoDir, cb) {
        console.log('git status start');
        exec("git status -s", { cwd: repoDir }, function(err, stdout, stderr) {
            if (!err) {
                console.log('git status end');
                cb(result(0, '', stdout));
            } else {
                console.log(stderr);
                cb(result(1, 'git status error', stderr));
            }
        })
    },
    checkout: function(branch, repoDir, cb, flag) {
        console.log('git checkout start');
        var _this = this;
        _fs.exists(repoDir, function(exists) {
            if (exists) {
                exec("git checkout " + branch, { cwd: repoDir }, function(err, stdout, stderr) {
                    if (!err) {
                        console.log('git checkout end');
                        cb(result(0, '', stdout));
                    } else {
                        console.log(err);
                        if (err.code == 128) {
                            rmFile('.git/index.lock', repoDir, function(res) {
                                if (!res.code) {
                                    if (flag) { //最多尝试2次
                                        cb(result(1, 'git checkout error', res.data));
                                        return;
                                    }
                                    _this.checkout(branch, repoDir, cb, true);
                                } else {
                                    cb(result(1, 'git checkout error', res.data));
                                }
                            })
                        } else {
                            cb(result(1, 'git checkout error', stderr));
                        }
                    }
                })
            } else {
                _this.init(repoDir, function() {
                    exec("git checkout " + branch, { cwd: repoDir }, function(err, stdout, stderr) {
                        if (!err) {
                            console.log('git checkout end');
                            cb(result(0, '', stdout));
                        } else {
                            console.log(err);
                            if (err.code == 128) {
                                rmFile('.git/index.lock', repoDir, function(res) {
                                    if (!res.code) {
                                        if (flag) { //最多尝试2次
                                            cb(result(1, 'git checkout error', res.data));
                                            return;
                                        }
                                        _this.checkout(branch, repoDir, cb, true);
                                    } else {
                                        cb(result(1, 'git checkout error', res.data));
                                    }
                                })
                            } else {
                                cb(result(1, 'git checkout error', stderr));
                            }
                        }
                    })
                })
            }
        });

    },
    init: function(repoDir, cb) {
        console.log('git init start');
        repoDir = repoDir.substring(0, repoDir.lastIndexOf('/'));
        exec("git clone git@git.ipo.com:sunjia032/doc.git", { cwd: repoDir }, function(err, stdout, stderr) {
            if (!err) {
                console.log('git init success');
                cb(result(0, '', stdout));
            } else {
                console.log(stderr);
                cb(result(1, 'git init error', stderr));
            }
        })
    }
}

function rmFile(filename, repoDir, cb) {
    console.log('rm start');
    exec('rm -rf ' + filename, { cwd: repoDir }, function(err, stdout, stderr) {
        if (!err) {
            console.log('rm end');
            cb(result(0, '', stdout));
        } else {
            cb(result(1, 'rmFile error', stderr));
        }
    });
}

module.exports = cmdController;
