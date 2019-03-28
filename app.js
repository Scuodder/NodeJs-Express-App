const express = require('express') ;
const path = require('path');
const app = express() ;
const mongoose = require('mongoose') ;
const Article = require('./models/article')
const session = require('express-session') ; // to be used as a middleware function
const articleRoute = require('./routes/articles.js')
const userRoute = require('./routes/users.js ');
const config = require('./config/database');
const passport = require('passport') 

mongoose.connect(config.database, {useNewUrlParser: true} );
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
app.use(express.urlencoded({extended : false}))  // body parsers are important for providing you req.body to 
// data passed to the server through ajax , forms etc ...

app.use(session({
    resave : false , 
    secret : 'secret',
    saveUninitialized : true 
}))

// set public folder 
app.use(express.static(path.join(__dirname, 'public')));

// show list of articles

require('./config/passport.js')(passport) ;
app.use(passport.initialize())
app.use(passport.session())

app.get('*',function(req, res,next) {
    res.locals.user = req.user || null
    next() ;
})

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

// routes

app.use('/articles', articleRoute)
app.use('/users', userRoute)


app.listen(3000, function() {
    console.log("server started on http://localhost:3000")
})