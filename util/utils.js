/**
 * Module dependencies.
 */



/**
 * Expose
 */
var utilsController = {
    result: function(code, msg, data) {
        return {
            code: code,
            msg: msg,
            data: data
        }
    },
    resultModule: function(code, msg, data) {
        return {
            code: code,
            msg: msg,
            data: data
        }
    },
    errorModule: function(code, erron, errmsg) {
        return {
            code: code,
            erron: erron,
            errmsg: errmsg
        }
    },
    bread: function(path, basePath) {
        var arr = path.split('/');
        var result = [];
        for (var i = 1; i < arr.length; i++) {
            var temp = { name: arr[i] };
            if (i > 1) {
                temp.url = basePath + '/' + arr.slice(1, i).join('/') + '/' + arr[i];
            } else {
                temp.url = basePath + '/' + arr[i];
            }

            result.push(temp);
        }
        return result;
    },
    nav: { 
        addTag: function(source) {　　
            var reg = /(^|\r\n)### (.*)\r\n/g;　　
            while (res = reg.exec(source)) {　　 console.log(res[2]);　　 }
        },
        getTag: function(reg, tagIndex,type, source) {
            var result = [];
            var count=0;
            while (res = reg.exec(source)) {
                result.push({
                    index: res.index,
                    text:this.getTitle(res[tagIndex]),
                    type:type,
                    id:'nl_'+type+'_'+(count++)
                });　　  　
            }
            return result;
        },
        sortTag: function() {

        },
        getTitle:function(source){
          return source;
        },
        tagList:function(source){
          var result=[];
          //h3 ###
          result.append(this.getTag());
          //todo h2 ##
          //todo h2 --
          //todo h1 #
          //todo h1 ==

        }
    }
}
module.exports = utilsController;
