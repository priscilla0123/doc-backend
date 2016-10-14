/**
 * Module dependencies.
 */
var doc = require('../controller/doc');

/**
 * Expose
 */

module.exports = function(app) {
    
    /*文件 */
    //预览
    app.get('/doc/:rootpath/viewfile/*', doc.viewFile);

    /*目录 */ 
    app.get('/ajax/doc/menu/*', doc.getMenu); //获取子目录
    
    app.get('/ajax/doc/file/count',doc.getFileCount);//获取子文件数量
    app.get('/ajax/doc/folder/count',doc.getFolderCount);//获取子文件夹数量

    /*文档首页 */
    app.get('/doc', doc.home);
    app.get('/doc/:rootpath', doc.index);

};
