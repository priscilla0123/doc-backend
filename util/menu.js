/**
 * Model
 
 Menu() {
    path,
    type,
    name,
    url 
}
*/


/**
 * Module dependencies.
 */
var resultModule = require('./utils').resultModule;
var file = require('./file');
var assign = require('object.assign').getPolyfill();
var _path = require('path');

/**
 * Expose
 */
var menuController = {
    option: {
        expireTime: 60 * 60 * 24,
        rootPath: './doc',
        baseUrl: '/doc',
        menuCatch: []
    }, 
    get:function(path,baseUrl,callback){ 
        var _this = this; 
        var MenuList = []; 
         
        file.getChildren(path, false, function(result) {
            if(result.code==0){ 
                result.data.filter(function(i){ //文件过滤
                    var ext=_path.extname(i.path); 
                    return ext==".md"||ext==".html"||ext==".txt";
                }).forEach(function(item) { 
                    var Menu = item; 
                    Menu.url = baseUrl + '/' + item.name; 
                    MenuList.push(Menu);  
                })  
                callback(resultModule(0, '', MenuList));
            }
            else{
                callback(resultModule(1, result.msg))
            }
            
        }) 
    },
    delCatch: function() {
        this.option.menuCatch = [];
    },
    checkCatch: function() {
        return true;
    }
}

module.exports = menuController;
