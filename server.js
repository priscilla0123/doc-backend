var ejs = require('ejs');
var markdown=require('markdown');
var express = require('express'); 
var app = express();

   
 
var file=require('./controller/file'); 
var config=require('./config/config'); 


/* base config */
app.engine('html', ejs.renderFile);
app.set('views', config.root + '\\views');
app.set('view engine', 'html');

   
app.get('/home', function(req, res){  
    file.getChildren('./doc',false,function(data){ 
        res.render('home',{
           data:data
        });
    });    
}); 
 
app.get('/view/*', function(req, res){  
    
    var filePath=config.docPath+req.url.split('/view/')[1];
    console.log(filePath);
    file.read(filePath,function(result){ 
        res.render('index',{
           data:markdown.parse(result.data)
        }); 
    }) 
});    
 
    
app.listen(config.port);    
console.log('Listening on port',config.port); 