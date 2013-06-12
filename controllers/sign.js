var User = require('../proxy').User;
var crypto = require('crypto');
var Util = require('../lib/util');
var config = require('../config').config;
exports.reg = function(req,res,next){
    var name = req.body.usernamesignup;
    var passwd = req.body.passwordsignup;
    var email = req.body.emailsignup;
    User.getUsersByQuery({name:name},{},function(err){
        if (err) {
            return next(err);
        }
        passwd = md5(passwd);
        User.newAndSave(name,passwd,email,function(err,user){
            if (err) {
                return next(err);
            }
            req.session.user = user;
            res.redirect('/');
        })
    })
}

exports.checkUnique = function(req,res,next){
    var name = req.body.name;
    var email = req.body.email;
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
    var name = req.body.username;
    var passwd = md5(req.body.password);
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
        gen_session(user, req, res);
        res.json(true);
    })
}

exports.logout = function(req,res){
    req.session.destroy();
    res.clearCookie(config.auth_cookie_name, { path: '/' });
    res.redirect('/');
}

// auth_user middleware
exports.auth_user = function (req, res, next) {
    var cookie = req.cookies[config.auth_cookie_name];
    if (!cookie) {
        return next();
    }
    var auth_token = decrypt(cookie, config.session_secret);
    var auth = auth_token.split('\t');
    var user_name = auth[1];
    User.getUserByName(user_name, function (err, user) {
        if (err) {
            return next(err);
        }
        if (user) {
            req.session.user = user;
            return next();
        } else {
            return next();
        }
    });
}

function md5(str) {
    var md5sum = crypto.createHash('md5');
    md5sum.update(str);
    str = md5sum.digest('hex');
    return str;
}

function gen_session(user,req,res) {
    var auth_token = encrypt(user._id + '\t' + user.name + '\t' + user.passwd + '\t' + user.email + '\t' + user.post_count + '\t' + user.__v, config.session_secret);
    res.cookie(config.auth_cookie_name, auth_token,
        {path: '/', maxAge: req.body.loginkeeping*365*24*3600*1000, httpOnly: true});
}

function encrypt(str, secret) {
    var cipher = crypto.createCipher('aes192', secret);
    var enc = cipher.update(str, 'utf8', 'hex');
    enc += cipher.final('hex');
    return enc;
}

function decrypt(str, secret) {
    var decipher = crypto.createDecipher('aes192', secret);
    var dec = decipher.update(str, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
}