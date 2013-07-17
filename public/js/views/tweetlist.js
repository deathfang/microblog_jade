define(function(require,exports,module){
    var Backbone = require('backbone');
    var $ = require('jquery');
    var util = require('../util');
    var TweetList = require('../collections/tweets');
    var TweetView = require('./tweets');
    var TweetListView = Backbone.View.extend({
        el:'.postlist',
        events:{
            'mouseenter .media':'createOne'
        },
        initialize:function(){
//            this.listenTo(TweetList, 'add', this.addOne);
            this.render();
        },
        render:function(){
            this.$el.find(".time").each(function(){
                var postTime = $(this);
                util.timer(postTime);
            });
        },
        addOne:function(tweet,el){
            new TweetView({model:tweet,el:el});
        },
        newAttributes:function(text,html){
            return {
                text:text,
                html:html,
                updated:false
            }
        },
        createOne:function(e){
            e.preventDefault();
            var $target = $(e.target);
            var post = $target.find('.post p');
            TweetList.on('add',function(tweet){
                this.addOne(tweet,$target);
            })
            TweetList.add(this.newAttributes(
                post.text(),
                post.html()
            ));
            $target.off('mouseenter');
        }


    })
    module.exports = TweetListView;
})