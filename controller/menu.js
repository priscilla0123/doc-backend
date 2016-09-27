/**
 * Module dependencies.
 */ 
var resultModule = require('./utils').resultModule;
var file = require('./file'); 

/**
 * Expose
 */
var menuController = {
    option:{
        expireTime:60*60*24,
        rootPath:'./doc',
        baseUrl:'/doc',
        menuCatch:[]
    },
    get:function(callback,useCatch){
        var _this=this;
        var now=new Date();
        var menu=[];

        if(useCatch&&this.option.menuCatch&&this.checkCatch()){
            callback(this.option.menuCatch);
            return;
        } 
        file.getChildren(this.option.rootPath,false,function(result){ 
            result.data.forEach(function(item){
                if(item.type=='dir'){
                    var temp=item;
                    temp.url=_this.option.baseUrl+'/'+item.name;
                    menu.push(temp);
                }
            }) 
            _this.option.menuCatch=menu;
            callback(resultModule(0,'',menu));
        }) 
    },
    delCatch:function(){
        this.option.menuCatch=[];
    },
    checkCatch:function(){
        return true;
    }
}

module.exports = menuController;
