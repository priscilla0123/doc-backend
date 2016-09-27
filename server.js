var ejs = require('ejs');
var markdown=require('markdown');
var express = require('express'); 
var app = express();

   
 
var file=require('./controller/file'); 
var menu=require('./controller/menu'); 
var config=require('./config/config'); 
var bread = require('./controller/utils').bread;


/* base config */
app.engine('html', ejs.renderFile);
app.set('views', config.root + '\\doc-frontend\\view');
app.set('view engine', 'html');
app.use(express.static('doc-frontend\\static'));

   
app.get('/welcome', function(req, res){   
    res.render('page/welcome',{
        
    }); 
}); 

app.get('/doc', function(req, res){  
    console.log(bread('/a/b/c', '/doc'));
    menu.get(function(data){ 
        res.render('page/doc/index',{
            nav:data.data,
            bread:
            {
                title: '文件列表',
                list: bread('/a/b/c', '/doc')
            } 
        });
    },false);    
}); 


//test 
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