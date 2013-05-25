var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostSchema = new Schema({
    author:{type:String},
    content:{type:String},
    time:{type:Date,default: Date.now}
})

mongoose.model('Post',PostSchema)


