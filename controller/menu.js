/**
 * Model
 
 Menu() {
    path,
    type,
    name,
    url,
    class 
}
*/


/**
 * Module dependencies.
 */
var resultModule = require('./utils').resultModule;
var file = require('./file');
var assign = require('object.assign').getPolyfill();

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
    get: function(callback, useCatch, defaultM) {
        var _this = this;
        var now = new Date();
        var MenuList = [];

        if (useCatch && this.option.menuCatch && this.checkCatch()) {
            callback(this.option.menuCatch);
            return;
        }
        file.getChildren(this.option.rootPath, false, function(result) {
            result.data.forEach(function(item) {
                if (item.type == 'dir') {
                    var Menu = item;
                    Menu.url = _this.option.baseUrl + '/' + item.name;
                    if ((defaultM && defaultM == item.name) ||(!defaultM &&MenuList.length == 0))
                        Menu.class = 'active';
                    MenuList.push(Menu);
                }
            })
            _this.option.menuCatch = MenuList;
            callback(resultModule(0, '', MenuList));
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
