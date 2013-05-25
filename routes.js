var sign = require('./controllers/sign');
var site = require('./controllers/site');
var user = require('./controllers/user');
var post = require('./controllers/post');

module.exports = function (app) {
    app.get('/', site.index);
    app.post('/reg',sign.reg);
    app.post('/check_unique',sign.checkUnique);
    app.post('/login',sign.login);
    app.get('/logout',sign.logout);
    app.post('/post',post.create);
    app.get('/:user',user.index);
    app.post('/edit/:id',post.update);
    app.get('/del/:id',post.delete);
}