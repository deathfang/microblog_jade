define(function(require,exports,module){
    require.async('lib/jquery-plugins/jquery.animate-enhanced');
    var Backbone = require('backbone');
    var $ = require('jquery');
    var UA = require.async('UA');
    var htmlText = require('html-text');
    var util = require('../util');
    var CommonTweetView = require('./common_tweet');
    var MessagesAlert = require('./messages_tips');
    var TweetBox = require('../models/tweetbox');
    var TweetList = require('../collections/tweets');
    var TweetView = require('./tweets');
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
            this.model = new TweetBox;
            this.PLACEHOLDER = '<div>撰写新推文...</div>';
            this.tweetCount = $('.stats li:first strong');
            this.$editor = this.$(".textbox");
            this.editor = this.$editor[0];
            this.textLength = this.$('.tweet-counter');
            this.button = this.$('button');
            this.htmlRich = htmlText(this.editor,UA);
            //首次load需要reset
            this.listenTo(this.model,'reset',this.render);
            this.listenTo(this.model,'change:text',this.render);
            this.model.fetch();
            //model fetch后添加到{0:{}}
            this.model.save(this.model.get('0'));
            this.loadFocus();
        },
        render:function(){
            !this.$editor.attr("data-in-composition") &&
            CommonTweetView.textLengthTips(
                this.textLength,this.model.get('text'),
                this.disable.bind(this),this.enable.bind(this)
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
        openEdit:function(){
            if (!this.model.get('updated')) {
                this.$el.addClass('uncondensed');
                this.$editor.html('');
                this.htmlRich.setSelectionOffsets([0]);
            }
        },
        close:function(){
            if (!this.model.get('updated')) {
                this.$el.removeClass('uncondensed');
                this.$editor.html(this.PLACEHOLDER)
            }
        },
        isWhitespace:function(){
            return !this.model.get('text').trim()
        },
        updateOnEnter:function(e){
            //Mac习惯用command
            (e.metaKey || e.ctrlKey) && e.keyCode === 13 &&
                !this.button.attr("disabled") && this.$('form').trigger('submit');
        },
        loadFocus:function(){
            if (this.model.get('updated')) {
                this.$el.addClass('uncondensed');
                this.$editor.focus(function(){
                    this.htmlRich.setSelectionOffsets([
                        CommonTweetView.getTextWrap(this.editor).length
                    ])
                }.bind(this));
                this.$editor.html(this.model.get('html')).focus();
            }
        },
        saveEditData:function(){
            this.model.save({
                text:this.$editor.text(),
                html:this.$editor.html()
            });
            this.model.save({
                updated:this.isWhitespace() ? false : true
            })
        },
        withRichEditor:function(){
            CommonTweetView.withRichEditor.bind(this)()
        },
        createOnePost:function(e){
            e.preventDefault();
            this.$el.addClass("tweeting");
            $.post("/post",{post:CommonTweetView.getTextWrap(this.editor)},function(res){
                this.$el.removeClass("tweeting");
                var newPost = $(res).addClass('animate-hide animate-opacity');
                newPost.children().css('opacity',0);
                newPost.data({model:true});
                $(".postlist").prepend(newPost);
                this.tweetCount.text(parseInt(this.tweetCount.text()) + 1);
                var newPostTime = newPost.find(".time");
                util.timer(newPostTime);
                $.when(function(){
                        var dfd = $.Deferred();
                        setTimeout(function(){
                            newPost.removeClass('animate-hide');
                            dfd.resolve()
                        })
                        return dfd.promise()
                    }()).done(function(){
                        newPost.children().fadeTo(500,1);
                        setTimeout(function(){
                            newPost.removeClass('animate-opacity');
                            new MessagesAlert({
                                text:'你的推文已发布',
                                duration:1500
                            });
                        },500)
                    });
                TweetList.once('add',function(tweet){
                    var tweetView = new TweetView({model:tweet,el:newPost[0]});
                    tweetView.bind('restore',function(){
                        this.model.save(_.extend({},tweet.toJSON(),{updated:true}));
                        this.$editor.html(this.model.get('html')).focus();
                    }.bind(this))
                }.bind(this));
                TweetList.add(_.extend({backup:true},{
                    text:this.model.get('text'),
                    html:this.model.get('html')
                }, {updated:false}));
                this.model.save({text:'',updated:false});
                this.editor.blur();
            }.bind(this))
        }
    })
    module.exports = new TweetBoxView;
})