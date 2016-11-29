/**
 * Module dependencies.
 */
var file = require('../util/file');
var bread = require('../util/utils').bread;
var nav = require('../util/utils').nav;
var menu = require('../util/menu');
var config = require('../config/config');
var commond = require('../util/cmd');
var mime = require('../util/mimeType').types;

var marked = require('marked');
var URL = require('url');
var path = require('path');



/**
 * Expose
 */
//home page
exports.home = function(req, res, next) {
    commond.pull(config.docPath, 'master', function(pullResult) {
        file.getChildFolders(config.docPath, false, function(result) {
            if (result.code == 0) {
                res.render('page/doc/home', {
                    data: result.data
                });
                if (pullResult.code) {
                    // to do toast 文档更新失败，请刷新页面
                }
            } else {
                console.log(result.msg);
            }
        }, /^\./)
    });
};

exports.index = function(req, res, next) {
    var root = req.params['rootpath'];
    menu.get(config.docPath + '/' + root, '/' + root, function(result) {
        res.render('page/doc/index', {
            nav: result.data,
            bread: {
                title: root,
                list: bread('', root)
            },
            rootpath: root
        });
    })
};

exports.viewFile = function(req, res, next) {
    var arg = URL.parse(req.url, true).query;
    var filePath = decodeURIComponent(req.originalUrl).split('/doc/' + req.params['rootpath'] + '/viewfile/')[1];
    if (filePath) {
        if (arg.view) {
            filePath = filePath.split('?')[0];
            file.read(config.docPath + '/' + filePath, function(result) {
                if (result.code == 0) {
                    fileFilter(filePath, res, result);
                } else {
                    console.log(result.msg);
                }
            })
        } else {
            var ext = path.extname(filePath);

            ext = ext ? ext.slice(1) : 'unknown';

            var contentType = mime[ext] || "text/plain";

            res.writeHead(200, { 'Content-Type': contentType });
            res.sendFile(config.basePath + filePath);
            res.end();
        }
    } else {
        res.render('page/doc/detail', {
            data: {}
        });
    }
};



exports.getMenu = function(req, res, next) {
    var root = req.originalUrl.split('/ajax/doc/menu/')[1];
    menu.get(config.docPath + '/' + root, '/' + root, function(result) {
        if (result.code == 0) {
            res.json({
                code: 0,
                data: result.data
            });
        } else {
            res.json({
                code: 1,
                msg: result.msg
            });
        }
    });
};

exports.getFileCount = function(req, res, next) {
    var path = req.query.path;
    file.countsubFile(config.docPath + '/' + path, function(result) {
        if (result.code == 0) {
            res.json({
                code: 0,
                data: result.data
            });
        } else {
            res.json({
                code: 1,
                msg: result.msg
            });
        }
    })
}
exports.getFolderCount = function(req, res, next) {
    var path = req.query.path;
    var count = file.countsubFolder(config.docPath + '/' + path);
    if (count >= 0) {
        res.json({
            code: 0,
            data: count
        });
    } else {
        res.json({
            code: 1,
            msg: 'error'
        });
    }
}

exports.allMenu = function(req, res, next) {
    res.render('page/doc/home', {});
};


function fileFilter(filePath, res, result) {
    var ext = filePath.split('.')[1];
    switch (ext) {
        case 'md':
            var tagList = nav.tagList(result.data);
            res.render('page/doc/detail', {
                data: marked.parse(nav.formatContent(tagList, result.data)),
                tags: tagList
            });
            break;
        case 'text':
        case 'css':
        case 'js':
        case 'html':
        case 'xml':
            var tagList = nav.tagList(result.data);
            res.render('page/doc/plainDetail', {
                data: result.data
            });
            break;
        case 'png':
        case 'jpg':
        case 'jpeg':
        case 'gif': 
            res.writeHead(200, {'Content-Type': mime[ext]});
            res.write(result,'binary');
            res.end(); 
            break;
    }
}
