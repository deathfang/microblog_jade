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
        function closeMongodb (err) {
            mongodb.close();
            error(err)
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
                    closeMongodb(err);
                    // 封裝 posts 爲 Post 對象
                    var posts = [];
                    docs.forEach(function(doc, index) {
                        var post = new Post(doc.user, doc.post, doc.time,doc._id);
                        posts.push(post);
                    });
                    callback(null, posts);
                });
            }
            else if (!text && id) {
                collection.remove({_id : ObjectId(id)},closeMongodb)
            }
            else if (text && id) {
                collection.update({_id : ObjectId(id)},{$set:{post:text}},{safe:true},closeMongodb)
            }
        })
    })
}