define('static/page/doc/home/home.js', function(require, exports, module){
require.async('components/jquery/jquery.js', function($) {
    $('.doc-preview').bind('click', function() { 
        $('#tablerow').hide();
        $('#previewrow').show();
    })

    $('.back').bind('click',function(){
        $('#tablerow').show();
        $('#previewrow').hide();
    })

    var fun={
        init:function(){
            this.bindevent();
        },
        bindevent:function(){
            var _this=this; 
            $('.ibox-content').each(function(i,item){  
                _this.getFileCount($(item).attr('data-dir'),function(result){
                    $(item).find('.filecount').html(result);
                });
                _this.getFoulderCount($(item).attr('data-dir'),function(result){
                    $(item).find('.foldercount').html(result);
                }); 
            })

            $('.HB_cover').bind('mouseout',function () { 
            })
        },
        getFileCount:function(path,cb){
            this.ajaxService('/ajax/doc/file/count','GET',{path:path},function(result){
                if(result.code==0){
                    cb(result.data); 
                }  
            }) 
        },
        getFoulderCount:function(path,cb){
            this.ajaxService('/ajax/doc/folder/count','GET',{path:path},function(result){                 
                if(result.code==0){
                    cb(result.data); 
                }  
            }) 
        }, 
        ajaxService: function(url, type, data, success, always) {
            $.ajax({
                url: url,
                type: type,
                dataType: "json",
                data: data,
                success: function(res) {
                    success && success(res);
                },
                error: function() {
                    console.log(arguments[1]);
                }
            }).always(function() {
                always && always();
            });
        } 
    }

    fun.init();
});
});