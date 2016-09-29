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

   
 

// app.get('/doc', function(req, res){  
//     menu.get(function(m){  
//         file.getChildren(m.data[0].path,false,function(table){ 
//             res.render('page/doc/index',{
//             nav:m.data,
//             bread:
//             {
//                 title: 'Documents List',
//                 list: bread(m.data[0].url, '/doc')
//             },
//             table:table.data
//         });
//         })
//     },false);    
// }); 


// app.get('/doc/*', function(req, res){ 
//     var currentMenu=req.originalUrl.split('/doc/')[1].split('/')[0];
//     var currentPath='';
//     var currentUrl='';
//     menu.get(function(m){  
//         m.data.forEach(function(item,i){ 
//             if(item.name==currentMenu){
//                 currentPath=item.path;
//                 currentUrl=item.url;
//             }
//         }) 
//         file.getChildren(currentPath,false,function(table){ 
//             res.render('page/doc/index',{
//                 nav:m.data,
//                 bread:
//                 {
//                     title: 'Documents List',
//                     list: bread(currentUrl, '/doc')
//                 },
//                 table:table.data
//             });
//         })
//     },false,currentMenu);    
// }); 


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
 
require('./config/route')(app);
require('./config/docRoute')(app);
  
app.listen(config.port);    
console.log('Listening on port',config.port); 