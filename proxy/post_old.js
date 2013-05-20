var mongodb = require('./../models/db'),
    jade =  require('jade'),
    ObjectId = require('mongodb').ObjectID,
    Util = require('../libs/util');

var User = require('user');

function Post(username, post, time,id) {
    this.user = username;
    this.post = post;
    if(time) {
        this.time = time;
    } else {
        this.time = new Date();
    }
    this.id = id
};
module.exports = Post;

//在此处readFile会报错 手动提取jade字符串
var postTemplate = 'li.media.animate-hide(id=_id)\n    a.pull-left(href="/" + user)\n        strong.fullname #{user}\n        img.media-object.avatar(src="../img/avatar.png")\n    .media-body\n        !{time}\n        .post: p !{post}\n        .tweet-actions\n            a(href="",title="删除").icon-remove.fade\n            a(href="",title="编辑").icon-edit.fade\n            a(href="",title="保存").icon-save.fade.hide';

Post.prototype.save = function (callback) {
    // 存入 Mongodb 的文档
    var post = {
        user: this.user,
        post: this.post,
        time: this.time,
        _id:ObjectId(Math.random())
    };
    mongodb.open(function(err, db) {
        if(err) {
            return callback(err);
        }
        // 读取 posts 集合
        db.collection('posts', function(err, collection) {
            if(err) {
                mongodb.close();
                return callback(err);
            }
            // 为 user 属性添加索引
            collection.ensureIndex('user');
            // 写入 post 文档
            collection.insert(post, {safe: true}, function(err, post) {
                db.collection('users',function(err,collection){
                    if(err) {
                        mongodb.close();
                        return callback(err);
                    }
                    collection.update({name:post[0].user},{$inc:{count:1}},{safe:true},function(err,inc){
                        if(err) {
                            return callback(err);
                        }
                        mongodb.close();
                        //insert后的post是一个单数组
                        var dbPost = post[0];
                        var sessionPost = Util.postFormat(dbPost.post,dbPost.time);
                        sessionPost.user = dbPost.user;
                        sessionPost._id = dbPost._id;
                        callback(null,sessionPost._id,jade.compile(postTemplate)(sessionPost),inc,dbPost.time);
                    })
                })
            });
        });
    });
};

Post.handle = function (getpost,post,user,callback) {
    mongodb.open(function(err, db) {
        function error(err){
            if (err) {
                return callback(err);
            }
        }
        db.collection('posts', function(err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            if (getpost){
                // 查找 user ?性? username 的文?，如果 username 是 null ?匹配全部
                var query = {};
                if (post && post.username) {
                    query.user = post.username;
                }
                collection.find(query).sort({time: -1}).toArray(function(err, docs) {
                    error(err);
                    mongodb.close();
                    var posts = [];
                    docs.forEach(function(doc) {
                        var post = new Post(doc.user, doc.post, doc.time,doc._id);
                        var sessionPost = Util.postFormat(post.post,post.time);
                        sessionPost.user = post.user;
                        sessionPost.id = post.id;
                        posts.push(sessionPost);
                    });
                    callback(null,posts);
                });
            }
//            else if (!getpost) {
                else if (post.id && post.username) {
                    collection.remove({_id : ObjectId(post.id)},function(err){
                        if(err) {
                            mongodb.close();
                            return callback(err);
                        }
                        mongodb.close();
                        callback(null)
//                        User.handle(mongodb,db,user,callback)
                    });
                }
                else if (post.post){
                    var now;
                    collection.update(
                        {_id : ObjectId(post.id)},
                        {$set:{
                            post:post.post,
                            time:(function(){return now = new Date()})()
                        }},
                        {safe:true},
                        function(err){
                            error(err);
                            mongodb.close();
                            callback(null,Util.postFormat(post.post,now),now)
                    })
                }
//            }
        })
    })
}