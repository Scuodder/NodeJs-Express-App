const express = require('express') ;
const path = require('path');
const app = express() ;
// pug/jade 
// console.log(path.join(__dirname, 'views') )
app.set('views', path.join(__dirname, 'templates'));
app.set('view engine', 'pug');

app.get('/', function(req, res) {
    let articles = [
        {
            id : 1,
            title : 'Article One' ,
            author : 'Scuodder', 
            body : 'first Article' 
        },
        
        {
            id : 1,
            title : 'Article two' ,
            author : 'Scuodder', 
            body : 'Second Article' 
        },
        
        {
            id : 1,
            title : 'Article three' ,
            author : 'Scuodder', 
            body : 'Third Article' 
        }
    ];

    res.render('index', {
        title : 'Articles',
        articles 
    }) ;
})
app.get('/articles/add',function(req, res, next) {
    res.render('add_article', {
        title: 'add Article'
    })
})


app.listen(3000, function() {
    console.log("server started on http://localhost:3000")
})