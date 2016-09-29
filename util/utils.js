/**
 * Module dependencies.
 */ 



/**
 * Expose
 */
 var utilsController={
    resultModule:function(code,msg,data){
        return {
          code:code,
          msg:msg,
          data:data
        }
    },
    errorModule:function(code,erron,errmsg){
        return {
          code:code,
          erron:erron,
          errmsg:errmsg
        }
    },
    bread:function(path,basePath){
      var arr=path.split('/');
      var result=[];
      for(var i=1;i<arr.length;i++){
        var temp={name:arr[i]};
        if(i>1){
          temp.url=basePath+'/'+arr.slice(1,i).join('/')+'/'+arr[i];
        }
        else{
          temp.url=basePath+'/'+arr[i];
        }
        
        result.push(temp);
      }
      return result;       
    }
 }
 module.exports=utilsController;