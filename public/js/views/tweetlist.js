define(function(require,exports,module){
    var Backbone = require('backbone');
    var $ = require('jquery');
    var util = require('../util');
    var CommonTweetView = require('./common_tweet');
    var MessagesAlert = require.async('./message_alert');
    var TweetList = require('../collections/tweets');
    var TweetListView = Backbone.View.extend({
        el:'.postlist',
        events:{

        },
        initialize:function(){
            this.listenTo(TweetList, 'add', this.addOne);
            this.$el.find(".time").each(function(){
                var postTime = $(this);
                util.timer(postTime);
            });
        },
        render:function(){

        },
        addOne:function(tweet){
            new TweetsView({model:tweet});
        }


    })
    module.exports = TweetListView;
})