var mongodb = require('./db'),
    ObjectId = require('mongodb').ObjectID;

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

var urlRxp = new RegExp("((news|telnet|nttp|file|http|ftp|https)://)?(([-A-Za-z0-9]+(\\.[-A-Za-z0-9]+)*(\\.[-A-Za-z]{2,5}))|([0-9]{1,3}(\\.[0-9]{1,3}){3}))(:[0-9]*)?(/[-A-Za-z0-9_\\$\\.\\+\\!\\*\\(\\),;:@&=\\?/~\\#\\%]*)*","gi");
var tmplTool = {}
tmplTool.NAMETAG = '<a href="{url}" title="{url}" target="_blank" rel="nofollow">{text}</a>';
tmplTool.SUBREGEX = /\{\s*([^|}]+?)\s*(?:\|([^}]*))?\s*\}/g;
tmplTool.isUndefined = function(o) {
    return typeof o === 'undefined';
};
tmplTool.sub = function(s, o) {
    return s.replace ? s.replace(tmplTool.SUBREGEX, function (match, key) {
        return tmplTool.isUndefined(o[key]) ? match : o[key];
    }) : s;
};


function PostFormat(post,time){
    var tokens = {}, links = null,
        hasUrl = post.match(urlRxp);
    if (hasUrl) {
        links = function(match) {

            if (!match.match("://")) {
                match = "http://" + match
            }
            tokens.url = match;
            tokens.text = tokens.url.replace(/(http:\/\/)?www\./, "").slice(0,20);
            tokens.text.length >= 19 && (tokens.text = tokens.text.slice(0,19) + "...")
            return tmplTool.sub(tmplTool.NAMETAG, tokens);
        }
    }
    return hasUrl ? post.replace(urlRxp,links) : post;
}


Post.prototype.save = function (callback) {
    // 存入 Mongodb 的文档
    var post = {
        user: this.user,
        post: this.post,
        time: this.time,
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
            collection.insert(post, {
                safe: true
            }, function(err, post) {
                mongodb.close();
                callback(err);
            });
        });
    });
};

Post.handle = function (getpost,username,id,text,callback) {
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
                if (username) {
                    query.user = username;
                }
                collection.find(query).sort({time: -1}).toArray(function(err, docs) {
                    error(err);
                    mongodb.close();
                    // 封裝 posts 爲 Post 對象
                    var posts = [];
                    docs.forEach(function(doc, index) {
                        var post = new Post(doc.user, doc.post, doc.time,doc._id);
                        post.post = PostFormat(post.post);
                        posts.push(post);
                    });
                    callback(null, posts);
                });
            }
            else if (!text && id) {
                collection.remove({_id : ObjectId(id)},function(err){
                    error(err);
                    mongodb.close();
                    callback(null,true)
                })
            }
            else if (text && id) {
                collection.update({_id : ObjectId(id)},{$set:{post:text}},{safe:true},function(err){
                    error(err);
                    mongodb.close();
                    callback(null,true)
                })
            }
        })
    })
}