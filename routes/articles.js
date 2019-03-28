const express = require('express');
const router = express.Router() ;
const { check, validationResult } = require('express-validator/check')
const Article = require('../models/article')
const User= require('../models/user.js')
// render add new article form
router.get('/add',authenticator,function(req, res, next) {
    
    res.render('add_article', {
        title: 'Add Article'
    })
})

// add new article to db when post request is recieved and then redirect to '/'
router.post('/add',
    [
        check('title').not().isEmpty({ignore_whitespace:true}).withMessage("Title field shouldn't be empty"),
        // check('author').not().isEmpty({ignore_whitespace:true}).withMessage("Author field shouldn't be empty"),
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
    article.author = req.user._id ;
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
router.get('/:id', function(req, res){
    Article.findById(req.params.id, function(err, article) {
        
        if(err) {
            console.log(err)
            return;
        }

        User.findById(article.author, function(err, user ){
            if (err) {
                console.log(err)
                return
            }
            res.render('article', {
                article,
                author : user.name
            })
        
        })
        
    })
})

// render edit article form when user clicks edit button
router.get('/edit/:id', authenticator ,function(req, res){
    Article.findById(req.params.id, function(err, article) {
        if(err) {
            console.log(err)
            return;
        }

        if(article.author != req.user._id){
            res.redirect('/')
            return
        }

        res.render('edit_article', {
            article
        })
    })
})

// when user clicks submit after modifying the article update the db and redirect to home '/'
router.post('/edit/:id', function(req, res) {
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
router.get('/delete/:id', authenticator,function(req,res) {

    Article.remove({_id:req.params.id},function(err) {
        if (err) {
            console.log(err)
            return ;
        } else {
            res.redirect('/')
        }
    })
})

function authenticator (req, res, next) {
    if(req.user) {
        next()
        return
    }
    res.redirect('/users/login')
}


module.exports = router;