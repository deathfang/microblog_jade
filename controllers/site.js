var User = require('../proxy').User;
var Post = require('../proxy').Post;
var EventProxy = require('eventproxy');
var config = require('../config').config;
var Util = require('../lib/util');

exports.index = function(req,res,next){
    var limit = config.list_topic_count;
    var render = function(posts){
        res.render('index',{
            title: '首頁',
            header_title:'推文',
            posts:posts,
            user:req.session.user
        })
    }
    var options = {limit: limit, sort:{time:-1}};
    if (req.session.user){
        Post.getPostsByQuery({},options,function(err,posts){
            if (err) {
                return next(err);
            }
            render(posts);
        });
    }
    else {
        res.render('sign');
    }
}