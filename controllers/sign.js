var User = require('../proxy').User;
var crypto = require('crypto');

exports.reg = function(req,res,next){
    var name = req.body.usernamesignup.xss();
    var passwd = req.body.passwordsignup.xss();
    User.getUsersByQuery({name:name},{},function(err){
        if (err) {
            return next(err);
        }
        passwd = md5(passwd);
        User.newAndSave(name,passwd,function(err,user){
            if (err) {
                return next(err);
            }
            req.session.user = user;
            res.redirect('/');
        })
    })
}

exports.checkUnique = function(req,res,next){
    var name = req.body.name.xss();
    var email = req.body.email.xss();
    User.getUsersByQuery({'$or': [{name: name}, {email: email}]},{},function(err,users){
        if (err) {
            return next(err);
        }
        if (users.length) {
            return res.json(false);
        }
        res.json(true);
    })
}

exports.login = function(req,res,next){
    var name = req.body.username.xss();
    var passwd = md5(req.body.password.xss());
    User.getUserByName(name,function(err,user){
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.send('err_id');
        }
        if (user.passwd !== passwd) {
            return res.send('err_pw');
        }
        req.session.user = user;
        res.cookie('user', user.name, { maxAge: req.body.loginkeeping*365*24*3600*1000, httpOnly: true })
        res.json(true);
    })
}

exports.logout = function(req,res){
    req.session.user = null;
    res.clearCookie('user');
    res.redirect('/');
}

function md5(str) {
    var md5sum = crypto.createHash('md5');
    md5sum.update(str);
    str = md5sum.digest('hex');
    return str;
}