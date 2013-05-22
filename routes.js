var sign = require('./controllers/sign');
var site = require('./controllers/site');
var user = require('./controllers/user');
var post = require('./controllers/post');

module.exports = function (app) {
    app.get('/', site.index);
    app.post('/reg',sign.reg);
    app.post('/check_username',sign.checkUserName);
    app.post('/login',sign.login);
    app.get('/logout',sign.logout);
    app.post('/post',post.create);
}