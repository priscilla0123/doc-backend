/**
 * Module dependencies.
 */
var file = require('../util/file');
var bread = require('../util/utils').bread;
var menu = require('../util/menu');
var config = require('../config/config');



/**
 * Expose
 */
//home page
exports.home = function(req, res, next) {
    res.render('page/doc/home', {});
};

exports.index = function(req, res, next) {
    var root = req.params['rootpath'];
    menu.get(config.docPath + root, '/' + root, function(result) {
        res.render('page/doc/index', {
            nav: result.data,
            bread: {
                title: root,
                list: bread('', root)
            }
        });
    })
};

exports.viewFile = function(req, res, next) {
    res.render('page/doc/home', {});
};

exports.updateFile = function(req, res, next) {
    res.render('page/doc/home', {});
};

exports.addFile = function(req, res, next) {
    res.render('page/doc/home', {});
};

exports.deleteFile = function(req, res, next) {
    res.render('page/doc/home', {});
};

exports.getMenu = function(req, res, next) {
    var root = req.originalUrl.split('/doc/ajax/menu/')[1];
    menu.get(config.docPath + root, '/' + root, function(result) {
        if (result.code == 0) {
            res.json({
                code:0,
                data: result.data
            });
        } else {
            res.json({
                code:1,
                msg: result.msg
            }); 
        }
    });
};

exports.allMenu = function(req, res, next) {
    res.render('page/doc/home', {});
};
