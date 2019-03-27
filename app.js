const express = require('express') ;
const path = require('path');
const app = express() ;
const mongoose = require('mongoose') ;
const Article = require('./models/article')
const { check, validationResult } = require('express-validator/check')

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

app.use(express.json())
app.use(express.urlencoded({extended : false}))

// set public folder 
app.use(express.static(path.join(__dirname, 'public')));

// show list of articles
app.get('/', function(req, res) {
  
    Article.find({}, function(err,articles){
        if (err) {
            console.log(err)
            return;
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
// render add new article form
app.get('/articles/add',function(req, res, next) {
    const errors = {}
    res.render('add_article', {
        title: 'Add Article'
    })
})

// add new article to db when post request is recieved and then redirect to '/'
app.post('/articles/add',
    [
        check('title').not().isEmpty({ignore_whitespace:true}).withMessage("Title field shouldn't be empty"),
        check('author').not().isEmpty({ignore_whitespace:true}).withMessage("Author field shouldn't be empty"),
        check('body').not().isEmpty({ignore_whitespace:true}).withMessage("Body field shouldn't be empty")
    ]
,function(req, res) {
    // console.log('submitted');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // console.log(errors.mapped())

        res.render("add_article", {
            title: 'Add Article',
            errorsAdd: errors.mapped() 
        })
        return;
    }

    let article = new Article()
    article.title = req.body.title;
    article.author = req.body.author ;
    article.body = req.body.body ;

    article.save(function(err) {
        if (err) {
            console.log(err)
            return;
        } else {
            res.redirect('/')
        }

    })
    
})

// render a particular article to the user when it clicks any article in the homepage
app.get('/article/:id', function(req, res){
    Article.findById(req.params.id, function(err, article) {
        if(err) {
            console.log(err)
            return;
        }
        res.render('article', {
            article
        })
    })
})

// render edit article form when user clicks edit button
app.get('/article/edit/:id', function(req, res){
    Article.findById(req.params.id, function(err, article) {
        if(err) {
            console.log(err)
            return;
        }
        res.render('edit_article', {
            article
        })
    })
})

// when user clicks submit after modifying the article update the db and redirect to home '/'
app.post('/articles/edit/:id', function(req, res) {
    // console.log('submitted');
    let article = {}
    article.title = req.body.title;
    article.author = req.body.author ;
    article.body = req.body.body ;

    Article.update({_id:req.params.id},article,function(err) {
        if (err) {
            console.log(err)
            return;
        } else {
            res.redirect('/')
        }

    })
    
})

// request for deleting the article 
app.get('/article/delete/:id', function(req,res) {
    Article.remove({_id:req.params.id},function(err) {
        if (err) {
            console.log(err)
            return ;
        } else {
            res.redirect('/')
        }
    })
})




app.listen(3000, function() {
    console.log("server started on http://localhost:3000")
})