
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var flash = require('connect-flash');
//var settings = require('./settings');
var config = require('./config').config;
//var lessToCSS = require('./lessToCSS');
//var MongoStore = require('connect-mongo')(express);
var fs = require('fs');
var path = require('path');
var accessLogfile = fs.createWriteStream('access.log', {flags: 'a'});
var errorLogfile = fs.createWriteStream('error.log', {flags: 'a'});

var app = express();

module.exports = app;

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.logger({stream: accessLogfile}));
  app.use(flash());
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({
    secret: config.session_secret
  }));
    app.use(function(req,res,next){
        res.locals.user = req.session.user;
        res.locals.error = req.flash('error').toString();
        next();
    });
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
    app.error(function (err, req, res, next) {
        var meta = '[' + new Date() + '] ' + req.url + '\n';
        errorLogfile.write(meta + err.stack + '\n');
        next();
    });
    app.set('view cache', true);
});
//lessToCSS();
require('./routes')(app);

if (!module.parent) {
    app.listen(3000);
    console.log("Express server listening on port %d in %s mode");
}

/**
 * node-mongodb-native   https://github.com/christkv/node-mongodb-native
 *
 * express-Migrating from 2.x to 3.x		https://github.com/visionmedia/express/wiki/Migrating-from-2.x-to-3.x
 *
 * Express 3.x + Socket.IO		http://blog.lyhdev.com/2012/07/nodejs-express-3x-socketio.html
 *
 * connect-flash		https://github.com/jaredhanson/connect-flash
 *
 * connect-mongo    https://github.com/kcbanner/connect-mongo
 *
 *
 */