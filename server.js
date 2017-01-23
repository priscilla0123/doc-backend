var ejs = require('ejs');
var express = require('express'); 
var app = express();

   
 
var file=require('./util/file');  
var config=require('./config/config');  


/* base config */
app.engine('html', ejs.renderFile);
app.set('views', config.root + '/dist/view');
app.set('view engine', 'html');
app.use(express.static(config.root + '/dist/static'));

 
//test 
app.get('/view/*', function(req, res){   
    var filePath=config.docPath+req.url.split('/view/')[1]; 
    file.read(filePath,function(result){  
        res.render('page/welcome',{
           data:markdown.parse(result.data)
        }); 
    }) 
});    

app.use('doc/', express.static(config.root + '/doc/static'));
 
require('./config/route')(app);
require('./config/docRoute')(app);
  
app.listen(config.port);    
console.log('Listening on port',config.port); 