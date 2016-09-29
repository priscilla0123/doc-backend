/**
 * Module dependencies.
 */
var doc = require('../controller/doc');

/**
 * Expose
 */

module.exports = function(app) {
    /*文档首页 */
    app.get('/doc', doc.home);
    app.get('/doc/:rootpath', doc.index);

    /*文件 */
    //预览
    app.get('/doc/ajax/file/get/:path', doc.viewFile);
    //编辑
    app.post('/doc/ajax/file/edit', doc.updateFile);
    //新建
    app.post('/doc/ajax/file/add', doc.addFile);
    //删除
    app.post('/doc/ajax/file/delete', doc.deleteFile);

    /*目录 */
    //获取子目录
    app.get('/doc/ajax/menu/*', doc.getMenu); 
};
