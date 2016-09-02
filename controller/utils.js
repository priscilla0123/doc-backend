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
    }
 }
 module.exports=utilsController;