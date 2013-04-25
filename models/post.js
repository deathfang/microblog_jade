var mongodb = require('./db'),
    jade =  require('jade'),
    ObjectId = require('mongodb').ObjectID,
    moment = require('moment');
moment.lang('zh-cn');
require('./moment.twitter');

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
var postLInkTemplate = 'a(href=url,title=url,target="_blank",rel="nofollow") #{text}';

var urlRxp = new RegExp("((news|telnet|nttp|file|http|ftp|https)://){1}(([-A-Za-z0-9]+(\\.[-A-Za-z0-9]+)*(\\.[-A-Za-z]{2,5}))|([0-9]{1,3}(\\.[0-9]{1,3}){3}))(:[0-9]*)?(/[-A-Za-z0-9_\\$\\.\\+\\!\\*\\(\\),;:@&=\\?/~\\#\\%]*)*","gi");

//在此处readFile会报错 手动提取jade字符串
var postTemplate = 'li.media(id=_id)\n    a.pull-left(href="/" + user)\n        strong.fullname #{user}\n        img.media-object.avatar(src="../img/avatar.png")\n    .media-body\n        a.time #{time}\n        .post: p !{post}\n        .tweet-actions\n            a(href="",title="删除").icon-remove.fade\n            a(href="",title="编辑").icon-edit.fade\n            a(href="",title="保存").icon-save.fade.hide';

function PostFormat(post,time){
    var tokens = {}, links = null,
        newPost = {},
        hasUrl = post.match(urlRxp);
    if (hasUrl) {
        links = function(match) {
            tokens.url = match;
            tokens.text = tokens.url.replace(/(http(s?):\/\/)?(www\.)?/, "");
            tokens.text.length > 19 && (tokens.text = tokens.text.slice(0,19) + "...")
            return jade.compile(postLInkTemplate)(tokens)
        }
    }
    newPost.post = hasUrl ? post.replace(urlRxp,links) : post;
    newPost.time = moment(time).twitter();
    return newPost;
}


//jade.compile(postTemplate)(post[0]);
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
                        var sessionPost = PostFormat(dbPost.post,dbPost.time);
                        sessionPost.user = dbPost.user;
                        sessionPost._id = dbPost._id;
                        callback(null,sessionPost._id,jade.compile(postTemplate)(sessionPost),inc);
                    })
                })
            });
        });
    });
};

Post.handle = function (getpost,post,callback) {
    mongodb.open(function(err, db) {
        function error(err){
            if (err) {
                return callback(err);
            }
        }
        // 讀取 posts 集合
        db.collection('posts', function(err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            if (getpost){
                // 查找 user 屬性爲 username 的文檔，如果 username 是 null 則匹配全部
                var query = {};
                if (post && post.username) {
                    query.user = post.username;
                }
                collection.find(query).sort({time: -1}).toArray(function(err, docs) {
                    error(err);
                    mongodb.close();
                    // 封裝 posts 爲 Post 對象
                    var posts = [];
                    docs.forEach(function(doc) {
                        var post = new Post(doc.user, doc.post, doc.time,doc._id);
                        var sessionPost = PostFormat(post.post,post.time);
                        sessionPost.user = post.user;
                        sessionPost.id = post.id;
                        posts.push(sessionPost);
                    });
                    callback(null,posts);
                });
            }
            else if (!getpost) {
                if (post.id && post.usernmae) {
                    collection.remove({_id : ObjectId(post.id)},function(err){
                        error(err);
                        db.collection('users',function(err,collection){
                            if(err) {
                                mongodb.close();
                                return callback(err);
                            }
                            collection.update({name:post.username},{$inc:{count:-1}},{safe:true},function(err){
                                error(err);
                                mongodb.close();
                                callback(null,(-1).toString())
                            })
                        })
                    });
                }
                else if (post.post){
                    collection.update({_id : ObjectId(post.id)},{$set:{post:post.post}},{safe:true},function(err){
                        error(err);
                        mongodb.close();
                        callback(null,PostFormat(post.post,post.time))
                    })
                }
            }
        })
    })
}