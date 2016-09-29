/**
 * Expose
 */

module.exports = function (app) {
  app.get('/welcome', function(req, res){   
      res.render('page/welcome'); 
  });    
};
