var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    name: { type: String, index: true, unique: true},
    passwd:{type:String},
    post_count:{ type: Number, default: 0}
})

mongoose.model('User', UserSchema);