/**
 * Module dependencies.
 */
var spliceString = require('splice-string');


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
        // 通过reg获取指定标签
        //*reg:正则
        //*textIndex:匹配结果下标
        //*typeCode:标签类型
        //*source:源
        //count:id初始值(不从0开始的要传)  
        getTag: function(reg, textIndex, typeCode, source, count) {
            var result = [];
            count = count ? count : 0;
            var offset = 0;
            var type = '';
            switch (typeCode) {
                //h3 ###
                case 0:
                    offset = 6;
                    type = 'h3';
                    break;
                    //h2 ##
                case 1:
                    offset = 5;
                    type = 'h2';
                    break;
                    //h2 --
                case 2:
                    offset = 2;
                    type = 'h2';
                    break;
                    //h1 #
                case 3:
                    offset = 4;
                    type = 'h1';
                    break;
                    //h1 ==
                case 4:
                    offset = 2;
                    type = 'h1';
                    break;

            } 
            while (res = reg.exec(source)) { 
                result.push({
                    index: res.index + offset,
                    text: this.getTitle(res[textIndex]),
                    type: type,
                    id: 'nl_' + type + '_' + (count++)
                });　　　
            }
            return result;
        },
        //标签按原文顺序排序
        sortTag: function() {
            return function(object1, object2) {
                var value1 = object1['index'];
                var value2 = object2['index'];
                if (value2 < value1) {
                    return 1;
                } else if (value2 > value1) {
                    return -1;
                } else {
                    return 0;
                }
            }
        },
        //todo 标签显示内容预处理
        getTitle: function(text) {
            return text;
        },
        //获取所有标题tag
        tagList: function(source) {
            var result = [];
            var l = 0;
            result = result.concat(this.getTag(/(^|\r\n)### (.*)\r\n?/g, 2, 0, source)); //h3 ### 
            l = result.length;
            result = result.concat(this.getTag(/(^|\r\n)## (.*)\r\n/g, 2, 1, source)); //h2 ## 
            result = result.concat(this.getTag(/(^|\r\n)(.*)\r\n-{2,}/g, 2, 2, source, result.length - l)); //h2 -- 
            l = result.length;
            result = result.concat(this.getTag(/(^|\r\n)# (.*)\r\n/g, 2, 3, source)); //h1 # 
            result = result.concat(this.getTag(/(^|\r\n)(.*)\r\n={2,}/g, 2, 4, source, result.length - l)); //h1 == 
            return result.sort(this.sortTag());
        },
        tagListforLinux:function(source){
            var result = [];
            var l = 0;
            result = result.concat(this.getTag(/(^|\n)### (.*)\n?/g, 2, 0, source)); //h3 ### 
            l = result.length;
            result = result.concat(this.getTag(/(^|\n)## (.*)\n/g, 2, 1, source)); //h2 ## 
            result = result.concat(this.getTag(/(^|\n)(.*)\n-{2,}/g, 2, 2, source, result.length - l)); //h2 -- 
            l = result.length;
            result = result.concat(this.getTag(/(^|\n)# (.*)\n/g, 2, 3, source)); //h1 # 
            result = result.concat(this.getTag(/(^|\n)(.*)\n={2,}/g, 2, 4, source, result.length - l)); //h1 == 
            return result.sort(this.sortTag());
        },
        //在tag位置添加link
        //tags:tagList
        //source:源
        formatContent: function(tags, source) {
            if (tags.length) {
                //如果文档第一个tag不以换行符开始
                if (!/^\r\n/.test(source) && tags[0].index == 6) {
                    tags[0].index = 4;
                }
                var totalOffset = 0;
                for (var i = 0; i < tags.length; i++) {
                    var link = '<a name="' + tags[i].id + '"></a>';
                    source = spliceString(source, tags[i].index + totalOffset, 0, link);
                    totalOffset += link.length;
                };
            }
            return source;
        },
        formatContentforLinux: function(tags, source) {
            if (tags.length) {
                //如果文档第一个tag不以换行符开始
                if (!/^\n/.test(source) && tags[0].index == 6) {
                    tags[0].index = 4;
                }
                var totalOffset = 0;
                for (var i = 0; i < tags.length; i++) {
                    var link = '<a name="' + tags[i].id + '"></a>';
                    source = spliceString(source, tags[i].index + totalOffset, 0, link);
                    totalOffset += link.length;
                };
            }
            return source;
        }
    },
    css: {
        //获取所有页面css
        cssList: function(source) {
            var result = [];
            result = result.concat(this.getCss(/(^|\r\n)<link (.*?)>/g, 2, source)); //<link ...... />   
            return result;
        },
        cssListforLinux: function(source) {
            var result = [];
            result = result.concat(this.getCss(/(^|\n)<link (.*?)>/g, 2, source)); //<link ...... />   
            return result;
        },
        // 通过reg获取指定标签
        //*reg:正则 
        //*index:匹配结果的下标
        //*source:源  
        getCss: function(reg, index, source) {
            var result = [];
            while (res = reg.exec(source)) {
                var href = /href="(.*)"/.exec(res[index]);
                if (href) {
                    result.push({ 
                        data: href[1]
                    });
                }  　
            }
            return result;
        }
    },
    js:{
        //获取所有页面js
        jsList:function(source){
            var result=[];
            result = result.concat(this.getJs(/(^|\r\n)<script (.*)><\/script>\r\n/g, 2, source)); //<script ...... ></script>   
            return result;
        },
        jsListforLinux:function(source){
            var result=[];
            result = result.concat(this.getJs(/(^|\n)<script (.*)><\/script>\n/g, 2, source)); //<script ...... ></script>   
            return result;
        },
        // 通过reg获取指定标签
        //*reg:正则 
        //*index:匹配结果的下标
        //*source:源  
        getJs:function(reg, index, source){
            var result = [];
            while (res = reg.exec(source)) {
                var src = /src="(.*)"/.exec(res[index]);
                if (src) {
                    result.push({ 
                        data: src[1]
                    });
                }  　
            }
            return result;
        }
    }
}
module.exports = utilsController;
