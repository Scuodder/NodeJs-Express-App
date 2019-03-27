let mongoose = require('mongoose') ;

// mongoose has Schema function to provide structure to each of our BSON documents. it accepts object for blueprint
//schema mongoose.Schema --> 
let articleSchema = mongoose.Schema({
    title : {
        type : String, 
        required : true 
    },

    author : {
        type : String, 
        required : true
    },

    body : {
        type : String , 
        required : true 
    }
});
// then we create a model using our schema
let Article = mongoose.model('Article',articleSchema );
module.exports = Article;