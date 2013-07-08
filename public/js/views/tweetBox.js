define(function(require,exports,module){
    var Backbone = require('backbone');
    var $ = require('jquery');
    var UA = require.async('UA');
    var htmlText = require('html-text');
    var util = require('../util');
    var CommonTweetView = require('./common_tweet');
    var MessagesAlert = require('./message_alert');
    var TweetBox = require('../models/tweetbox');
    var TweetBoxView = Backbone.View.extend({
        el:'.tweet-box',
        events:{
            'focus .textbox':'openEdit',
            'blur .textbox':'close',
            'keydown .textbox':'updateOnEnter',
            'keyup.withRichEditor .textbox':'withRichEditor',
            'paste.withRichEditor .textbox':'withRichEditor',
            'submit form':'createOnePost'
        },
        initialize:function(){
            this.PLACEHOLDER = '<div>撰写新推文...</div>',
            this.tweetCount = $('.stats li:first strong'),
            this.$editor = this.$(".textbox"),
            this.editor = this.$editor[0],
            this.textLength = this.$('.tweet-counter'),
            this.button = this.$('button');
            //首次load需要reset
            this.listenTo(TweetBox,'reset',this.render);
            this.listenTo(TweetBox,'change:text',this.render);

            TweetBox.fetch();

            this.loadFocus();
        },
        render:function(){
            CommonTweetView.textLengthTips(
                this.textLength,this.getText(),
                this.disable,this.enable
            );
        },
        enable:function(){
            this.button.removeClass("disabled")
                .removeAttr("disabled")
                .addClass('btn-primary')
        },
        disable:function(){
            this.button.addClass("disabled")
                .attr("disabled",true)
                .removeClass('btn-primary')
        },
        getText : function(){
            TweetBox.get('text')
        },
        toggleCondensed:function(){
            this.$el.toggleClass("uncondensed",!TweetBox.get('updated'));
        },
        openEdit:function(){
            this.toggleCondensed();
            !TweetBox.get('updated') && this.$editor.html('');
        },
        close:function(){
            this.toggleCondensed();
            !TweetBox.get('updated') && this.$editor.html(this.PLACEHOLDER);
        },
        isWhitespace:function(){
            return !this.getText().trim()
        },
        updateOnEnter:function(e){
            //Mac习惯用command
            (e.metaKey || e.ctrlKey) && e.keyCode === 13 &&
                !this.button.attr("disabled") && this.$('form').trigger('submit');
        },
        htmlRich:htmlText(this.editor,UA),
        loadFocus:function(){
            if (TweetBox.get('updated')) {
                this.$editor.focus(function(){
                    this.htmlRich.setSelectionOffsets([
                        CommonTweetView.getTextWrap(this.editor).length
                    ])
                }).focus();
                this.$editor.html(TweetBox.get('html'));
            }
        },
        saveData:function(){
            TweetBox.save({
                text:this.$editor.text(),
                html:this.$editor.html()
            });
            TweetBox.save({
                updated:this.isWhitespace() ? false : true
            })
        },
        withRichEditor:function(){
            CommonTweetView.withRichEditor.bind(this,TweetBox)
        },
        createOnePost:function(e){
            e.preventDefault();
            this.$el.addClass("tweeting");
            $.post("/post",{post:CommonTweetView.getTextWrap(this.editor)},function(res){
                this.$el.removeClass("tweeting");
                var newPost = $(res).addClass('animate-hide animate-opacity');
                newPost.children().css('opacity',0);
                $(".postlist").prepend(newPost);
                this.tweetCount.text(parseInt(this.tweetCount.text()) + 1);
                var newPostTime = newPost.find(".time");
                util.timer(newPostTime);
                $.when(function(){
                        var dfd = $.Deferred();
                        setTimeout(function(){
                            newPost.removeClass('animate-hide');
                            dfd.resolve()
                        },0)
                        return dfd.promise()
                    }()).done(function(){
                        newPost.children().fadeTo(500,1);
                        setTimeout(function(){
                            newPost.removeClass('animate-opacity');
                            new MessagesAlert({
                                text:"你的推文已发布!",
                                duration:1500,
                                className:"alert-tips"
                            })
                        },500)
                    })
//                storePostText.backup(newPost.attr('id'),tweetbox.get('html'));
                TweetBox.save({text:'',updated:false});
                this.editor.blur();
            })
        }
    })
    module.exports = TweetBoxView;
})