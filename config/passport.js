 const LocalStrategy = require('passport-local').Strategy;
 const User = require('../models/user')
 const config = require('../config/database')
 const bcrypt = require('bcryptjs')
//  const passport = require('passport')

 module.exports = function(passport) {

    passport.use(new LocalStrategy(function(username, password, done){
        let query = {username : username}
        User.findOne(query, function(err, user) {
            if (err) {
                return done(err)
            }

            if (!user) {
                return done(null, false, {message : 'Incorrect Username'})
            }

            bcrypt.compare(password, user.password, function(err, isMatch) {
                if (err) {
                    console.log(err)
                    return ;
                }
                if (!isMatch) {
                    return done(null, false, {message : "Wrong Password" })
                }

                return done(null, user)
            }) 
        })
        
    }))

    passport.serializeUser(function(user, done) {
        done(null, user.email);
      });
      
    passport.deserializeUser(function(email, done) {
    User.findOne({email: email}, function(err, user) {
        done(err, user);
    });
    });
 }