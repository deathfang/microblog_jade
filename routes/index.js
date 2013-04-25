var crypto = require('crypto');
var User = require('../models/user');
var Post = require('../models/post')

module.exports = function(app) {
    app.get('/', function(req, res) {
        if (req.session.user || req.cookies.user) {
            Post.handle(true,null,function(err, posts) {
                if (err) {
                    posts = []
                }
                if (!req.session.user) {
                    User.get(req.cookies.user, function(err, user) {
                        req.session.user = user;
                        res.render('index', {
                            title: '首頁',
                            posts:posts,
                            user:user,
                            header_title:"推文"
                        });
                    });
                }
                else {
                    res.render('index', {
                        title: '首頁',
                        posts:posts,
                        header_title:"推文"
                    });
                }
            });
        }
        else {
            res.render('sign');
        }
    })

    app.post('/reg',checkNotLogin)
    app.post('/reg', function(req, res) {

        //生成口令的散列值
        var md5 = crypto.createHash('md5');
        var password = md5.update(req.body.passwordsignup).digest('base64');

        var newUser = new User({
            name: req.body.usernamesignup,
            password: password,
        });

        //检查用户名是否已经存在
        User.get(newUser.name, function(err, user) {
            if (err) {
                return res.redirect('/#toregister');
            }
            //如果不存在则新增用户
            newUser.save(function(err) {
                if (err) {
                    return res.redirect('/#toregister');
                }
                req.session.user = newUser;
                res.redirect('/');
            });
        });
    });
    app.post('/check_username',function(req, res){
        User.get(req.body.username, function(err, user) {
            if (user)
                return res.send(false);
            if (err) {
                return res.redirect('/');
            }
            res.send(true);
        });
    });
    app.post('/login', checkNotLogin);
    app.post('/login', function(req, res) {
        //生成口令的散列值
        var md5 = crypto.createHash('md5');
        var password = md5.update(req.body.password).digest('base64');

        User.get(req.body.username, function(err, user) {
            if (!user) {
                return res.send('err_id');
            }
            if (user.password != password) {
                return res.send('err_pw');
            }
            req.session.user = user;
            res.cookie('user', user.name, { maxAge: req.body.loginkeeping*365*24*3600*1000, httpOnly: true })
            res.send(true);
        });
    });

    app.get('/logout', function(req, res) {
        req.session.user = null;
        res.clearCookie('user');
        res.redirect('/');
    });
    app.post('/post', checkLogin);
    app.post('/post', function(req, res) {
        var currentUser = req.session.user;
        var post = new Post(currentUser.name, req.body.post);
        post.save(function(err,id,postHTML,inc) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/');
            }
            req.session.user.count += inc;
            res.send({
                inc:inc,
                id:id,
                postHTML:postHTML
            });
        });
    });


    app.get('/:user', function(req, res) {
        User.get(req.params.user, function(err, user) {
            if (!user) {
                return res.sendfile('views/Page not found.html')
            }
            Post.handle(true,{username:user.name}, function(err, posts) {
                if (err) {
                    req.flash('error', err);
                    return res.redirect('/');
                }
                res.render('user', {
                    title: user.name,
                    posts: posts,
                    header_title:req.session.user.name === req.params.user ? "我的推文" : "Ta的推文"
                });
            });
        });
    });
    app.get('/del/:id',function(req,res){
//        console.log({usernmae:req.session.user.name,id:req.params.id});
        Post.handle(false,{usernmae:req.session.user.name,id:req.params.id},function(err,dec){
            if (err) {
                return res.redirect('/');
            }
            req.session.user.count += parseInt(dec);
            //不能send Number类型
            res.send(dec)
        })
    });
    app.post('/edit/:id',function(req,res){
        Post.handle(false,{id:req.params.id,post:req.body.post,time:req.body.time},function(err,newPost){
            if (err) {
                return res.redirect('/');
            }
            res.send(newPost)
        })
    });
    //route test
    app.get('/ua',function(req,res){
//        res.send(req.headers)
    });
    app.get('/ut/:user_test',function(req,res){
        res.send(req.params.user_test)
    })
}

function checkLogin(req, res, next) {
    if (!req.session.user) {
        req.flash('error', '未登入');
        return res.redirect('/');
    }
    next();
}

function checkNotLogin(req, res, next) {
    if (req.session.user) {
        req.flash('error', '已登入');
        return res.redirect('/');
    }
    next();
}