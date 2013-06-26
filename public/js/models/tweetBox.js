define(function(require,exports,module){
    var Backbone = require('backbone');
    require('lib/backbone.localStorage');
    var TweetBox = Backbone.Model.extend({
        defaults:{
            text:'',
            updated:false
        },
        toggle: function () {
            this.save({
                updated: !this.get('updated')
            });
        },
        localStorage:new Backbone.LocalStorage('tweetbox')
    })
    module.exports = TweetBox;
})