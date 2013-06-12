var User = require('../proxy').User;
var Post = require('../proxy').Post;
var EventProxy = require('eventproxy');
var config = require('../config').config;
var Util = require('../lib/util');

exports.index = function(req,res,next){
    var username = req.params.user;
    var limit = config.list_topic_count;
    var render = function(posts){
        res.render('user',{
            title: username,
            posts:posts,
            header_title:
                req.session.user && req.session.user.name === username ?
                    "我的推文" : "Ta的推文"
        })
    }
    var options = {limit: limit, sort:'-time'};
    var proxy = EventProxy.create('user','posts',render);
    proxy.fail(next);
    User.getUserByName(username,proxy.done(function(user){
        if (!user) {
            return res.sendfile('views/Page not found.html')
        }
        proxy.emit('user')
    }));
    Post.getPostsByQuery({author:username},options,proxy.done(function(posts){
        render(posts);
    }));
}
