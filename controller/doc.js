/**
 * Module dependencies.
 */
var file = require('../util/file');
var bread = require('../util/utils').bread;
var nav = require('../util/utils').nav;
var css = require('../util/utils').css;
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
//文档分类
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
//预览
exports.viewFile = function(req, res, next) {
    var type='utf8';
    var arg = URL.parse(req.url, true).query;
    var filePath = decodeURIComponent(req.originalUrl).split('/doc/' + req.params['rootpath'] + '/viewfile/')[1];
    if (filePath) {  
        var ext = path.extname(filePath);
        if(ext.indexOf('woff')>=0){
            type='binary';
        }
        filePath = filePath.split('?')[0];
        file.read(config.docPath + '/' + filePath,type, function(result) {
            if (result.code == 0) {
                if(arg.view){//文档文件
                    fileFilter(filePath, res, result);
                }
                else{ //静态文件
                    ext = ext ? ext.slice(1) : 'unknown'; 
                    var contentType = mime[ext] || "text/plain"; 
                    res.writeHead(200, { 'Content-Type': contentType }); 
                    if(ext.indexOf('woff')>=0){
                        res.end(result.data,'binary');  
                    }
                    else{
                        res.end(result.data);  
                    }
                }
            } else {
                console.log(result.msg);
            }
        })
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
    },/(.*).md|(.*).txt|(.*).html/)
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

// 文件显示
function fileFilter(filePath, res, result) { 
    var ext = path.extname(filePath).slice(1); 
    switch (ext) {
        case 'md':
            var tagList = nav.tagList(result.data);
            var cssList=css.cssList(result.data); 
            res.render('page/doc/detail', {
                data: marked.parse(nav.formatContent(tagList, result.data)),
                tags: tagList,
                links:cssList,
                baseUrl:res.req.url.substring(0,res.req.url.lastIndexOf('/'))
            });
            break;
        case 'text': 
        case 'html':
        case 'xml': 
        case 'png':
        case 'jpg':
        case 'jpeg':
        case 'gif':
            res.render('page/doc/plainDetail', {
                data: result.data
            });
            break; 
    }
}
