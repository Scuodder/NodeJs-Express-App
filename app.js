const express = require('express') ;
const path = require('path');
const app = express() ;
const mongoose = require('mongoose') ;
const Article = require('./models/article')

mongoose.connect('mongodb://localhost/nodekb', {useNewUrlParser: true} );
let db = mongoose.connection

//check connection
db.once('open', function(){
    console.log('connected')
})

// checking for errors 
db.on('error', function(error) {
    console.log(error)
})

// pug/jade 
// console.log(path.join(__dirname, 'views') )
app.set('views', path.join(__dirname, 'templates'));
app.set('view engine', 'pug');

app.get('/', function(req, res) {
  
    Article.find({}, function(err,articles){
        if (err) {
            console.log(err)
        }   
        else {
            console.log(articles)  // --->> remove this later 
            res.render('index', {
                title : 'Articles',
                articles 
            }) ;
        }
    })
  
})
app.get('/articles/add',function(req, res, next) {
    res.render('add_article', {
        title: 'add Article'
    })
})


app.listen(3000, function() {
    console.log("server started on http://localhost:3000")
})