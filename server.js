var ejs = require('ejs');
var markdown=require('markdown');
var express = require('express'); 
var app = express();

   
 
var file=require('./controller/file'); 
var config=require('./config/config'); 


/* base config */
app.engine('html', ejs.renderFile);
app.set('views', config.root + '\\doc-frontend\\view');
app.set('view engine', 'html');
app.use(express.static('doc-frontend\\static'));

   
app.get('/home', function(req, res){  
    file.getChildren('./doc',false,function(data){ 
        console.log(data);
        res.render('page/welcome',{
           data:data
        });
    });    
}); 

app.get('/doc', function(req, res){  
    file.getChildren('./doc',false,function(data){ 
        res.render('page/home',{
           data:data
        });
    });    
}); 
 
app.get('/view/*', function(req, res){   
    var filePath=config.docPath+req.url.split('/view/')[1]; 
    file.read(filePath,function(result){ 
        console.log(result.data);
        res.render('page/welcome',{
           data:markdown.parse(result.data)
        }); 
    }) 
});    
 
    
app.listen(config.port);    
console.log('Listening on port',config.port); 