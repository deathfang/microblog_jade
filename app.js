
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , flash = require('connect-flash')
  , settings = require('./settings')
  , MongoStore = require('connect-mongo')(express)
  , fs = require('fs')
  , accessLogfile = fs.createWriteStream('access.log', {flags: 'a'})
  , errorLogfile = fs.createWriteStream('error.log', {flags: 'a'});

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
    secret: settings.cookieSecret
    , store: new MongoStore({
        db: settings.db
    },function(){
          console.log('connect mongodb success...')
      })
  }));
    app.use(function(req,res,next){
        res.locals.user = req.session.user;
        res.locals.error = req.flash('error').toString();
        res.locals.success = req.flash('success').toString();
        next();
    });
  app.use(app.router);
  app.use(express.static(require('path').join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.configure('production', function(){
    app.error(function (err, req, res, next) {
        var meta = '[' + new Date() + '] ' + req.url + '\n';
        errorLogfile.write(meta + err.stack + '\n');
        next();
    });
});

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