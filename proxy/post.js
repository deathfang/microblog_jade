var EventProxy = require('eventproxy');
var models = require('../models');
var Post = models.Post;
var User = require('./user');
var Util = require('../libs/util');

exports.newAndSave = function(author,content,callback){
    var post = new Post();
    post.author = author;
    post.content = content;
    post.save(callback);
}