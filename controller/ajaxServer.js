/**
 * Module dependencies.
 */
var file = require('./file');
var markdown=require('markdown');


 /**
 * Expose
 */

exports.getfileContent = function (req, res, next) {
  var path = req.params['path'];
  file.read(path,function(result){  
      res.json({
         data:markdown.parse(result.data)
      }); 
  })  
};