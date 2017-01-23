define('widget/nav/nav.js', function(require, exports, module){
require.async('components/jquery/jquery.js', function($) {
    var fun = {
        init: function() {
            this.bindevent();
            this.$nav=$('.nav');
            this.frameBaseUrl=$('iframe').attr('data-basesrc'); 
        },
        bindevent: function() {
            var _this=this;
            $('.nav').on('click','.J_nav_folder',folderClick);
            $('.nav').on('click','.J_nav_file',fileClick);
        },
        getMenu:function(url,$obj,cb){
            this.ajaxService('/ajax/doc/menu'+url,'GET',{},function(data){
                if(data.code==0){
                    $obj.append('<ul class="nav collapse in"></ul>');
                    $ul=$obj.find('ul');
                    data.data.forEach(function(item,i){ 
                        if(item.type=='dir'){
                            $('<li><a class="J_nav_folder" href="javascript:;" data-url="'+item.url+'"><i class="fa fa-folder"></i> <span class="nav-label">'+item.name+'</span><span class="fa arrow"></span></a></li>').appendTo($ul);
                        }
                        else{
                            $('<li><a class="J_nav_file" href="javascript:;" data-url="'+item.url+'"><i class="fa fa-file-o"></i> <span class="nav-label">'+item.name+'</span></a></li>').appendTo($ul);
                        } 
                    })
                    cb&&cb();
                } 
            }) 
        },
        active:function(target){ 
            this.$nav.find('li.active').removeClass('active');
            target.addClass('active');
            var $ul=target.find('>ul');
            if($ul.length){
                if($ul.hasClass('in')){
                    $ul.removeClass('in');
                }
                else{
                    $ul.addClass('in');
                }
            } 
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


    function folderClick(){ 
        var $subUl=$(this).parent().find('>ul');
        var $parent=$(this).parent();
        if(!$subUl.length){ 
            fun.getMenu($(this).attr('data-url'),$parent);
        }  
        fun.active($parent);
    } 
    function fileClick(){ 
        //$('iframe').attr('src',encodeURIComponent(fun.frameBaseUrl+$(this).attr('data-url')+'?view=true')); 
        $('iframe').attr('src', fun.frameBaseUrl+$(this).attr('data-url')+'?view=true'); 
        
    }
});

});