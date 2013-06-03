var models = require('../models');
var Post = models.Post;
var User = require('./user');
var EventProxy = require('eventproxy');
var Util = require('../libs/util');

exports.getPostsByQuery = function(query, opt, callback){
    Post.find(query, null, opt, function (err, docs) {
        if (err) {
            return callback(err);
        }
        if (docs.length === 0) {
            return callback(null, []);
        }
        var posts_id = [];
        for (var i = 0; i < docs.length; i++) {
            posts_id.push(docs[i]._id);
        }
        var proxy = new EventProxy();
        var posts = [];
        proxy.after('post_ready', posts_id.length, function () {
            return callback(null, posts);
        });
        proxy.fail(callback);
        posts_id.forEach(function (id, i) {
            exports.getOnePost(id, proxy.done(function (post) {
                posts[i] = Util.merge(post._doc,Util.postFormat(post.content,post.time))
                proxy.emit('post_ready');
            }));
        });
    })
}

exports.getOnePost = function(id,callback){
    Post.findById(id,callback);
}

exports.newAndSave = function(author,content,callback){
    var post = new Post();
    post.author = author;
    post.content = content;
    post.save(callback);
}