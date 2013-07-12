define(function(require,exports,module){
    var Backbone = require('backbone');
    require('lib/backbone.localStorage');
    var TweetBox = Backbone.Model.extend({
        defaults:{
            text:'',
            html:'',
            updated:false
        },
        localStorage:new Backbone.LocalStorage('tweetbox')
    });
    module.exports = TweetBox;
})