var models = require('../models');
var Post = models.Post;
var User = require('./user');

exports.getPostsByQuery = function(query, opt, callback){
    Post.find(query, ['_id'], opt, function (err, posts) {
        if (err) {
            return callback(err);
        }
        if (docs.length === 0) {
            return callback(null, []);
        }
        callback(null,posts)
    })
}

exports.newAndSave = function(author,content,callback){
    var post = new Post();
    post.author = author;
    post.content = content;
    post.save(callback);
}