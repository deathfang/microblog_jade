define(function(require,exports,module){
    var Backbone = require('backbone');
    var $ = require('jquery');
    var util = require('../util');
    var CommonTweetView = require('./common_tweet');
    var MessagesAlert = require('./message_alert');
    var TweetListView = Backbone.View.extend({
        el:'.postlist',
        events:{

        },
        initialize:function(){

        }

    })
    module.exports = TweetListView;
})