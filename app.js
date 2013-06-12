
/**
 * Module dependencies.
 */

var express = require('express');
var flash = require('connect-flash');
var config = require('./config').config;
//var lessToCSS = require('./lessToCSS');
var path = require('path');


var app = express();

module.exports = app;

app.configure(function(){
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(flash());
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.session({
        secret: config.session_secret
    }));
    // custom middleware
    app.use(require('./controllers/sign').auth_user);
    app.use(function(req,res,next){
        res.locals.user = req.session.user;
        res.locals.error = req.flash('error').toString();
        next();
    });
    app.use(app.router);
});

var maxAge = 3600000 * 24 * 30;
var staticDir = path.join(__dirname, 'public');
app.configure('development', function(){
    app.use(express.static(staticDir));
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function () {
    app.use(express.static(staticDir, { maxAge: maxAge }));
    app.use(express.errorHandler());
    app.set('view cache', true);
});

//lessToCSS();
require('./routes')(app);

if (!module.parent) {
    app.listen(config.port);
    console.log("Express server listening on port %d in %s mode");
}

/**
 * node-mongodb-native   https://github.com/christkv/node-mongodb-native
 *
 * express-Migrating from 2.x to 3.x		https://github.com/visionmedia/express/wiki/Migrating-from-2.x-to-3.x
 *
 * Express 3.x + Socket.IO		http://blog.lyhdev.com/2012/07/nodejs-express-3x-socketio.html
 *
 */