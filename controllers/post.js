var User = require('../proxy').User;
var Post = require('../proxy').Post;
var Util = require('../libs/util');
var EventProxy = require('eventproxy');
var jade =  require('jade');

exports.create = function(req,res,next){
    var name = req.session.user.name;
    var proxy = EventProxy.create('post','user',function(post){
        var post = Util.merge(post,Util.postFormat(post.content,post.time));
        post = jade.compile(Util.postTemplate)(post);
        res.send({
            id:post._id,
            postHTML:post.content
        })
    });
    proxy.fail(next);
    Post.newAndSave(name,req.body.post,proxy.done('post'));
    User.getUserByName(name,proxy.done(function(user){
        user.post_count += 1;
        user.save();
        proxy.emit('user');
    }))
}

exports.update = function(req,res,next){
    var id = req.params.id;
    Post.findById(id,function(err,post){
        if (err) {
            return next(err);
        }
        post.content = req.body.post;
        post.time = new Date();
        post.save(function(err,doc){
            if (err) {
                return next(err);
            }
            res.send(Util.postFormat(doc.post,doc.time))
        })
    })
}

exports.delete = function (req, res, next){
    var id = req.params.id;
    var name = req.session.user.name;
    var proxy = EventProxy.create('post','user',function(){
        req.session.user.count--;
        //不能send Number类型
        res.json(true)
    });
    proxy.fail(next);
    Post.findById(id,proxy.done(function(post){
        post.remove();
        proxy.emit('post')
    }));
    User.getUserByName(name,proxy.done(function(user){
        user.post_count--;
        user.save();
        proxy.emit('user');
    }))
}