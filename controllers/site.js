var User = require('../proxy').User;
var Post = require('../proxy').Post;
var EventProxy = require('eventproxy');
var config = require('../config').config;

exports.index = function(req,res,next){
    var limit = config.list_topic_count;
    var render = function(posts,user){
        res.render('index',{
            title: '首頁',
            header_title:'推文',
            posts:posts,
            user:req.session.user || user
        })
    }
    var options = {limit: limit, sort:'-time'};
    if (!req.session.user && req.cookies.user) {
        var proxy = EventProxy.create('posts','user',render);
        proxy.fail(next);
        Post.getPostsByQuery({},options,proxy.done('posts'));
        User.getUserByName(req.cookies.user,proxy.done(function(user){
            req.session.user = user;
            proxy.emit('user',user);
        }))
    }
    else if (req.session.user) {
        Post.getPostsByQuery({},options,render);
    }
    else {
        res.render('sign');
    }
}