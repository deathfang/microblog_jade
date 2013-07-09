define(function(require,exports,module){
    var Backbone = require('backbone');
    var $ = require('jquery');
    var util = require('../util');
    var CommonTweetView = require('./common_tweet');
    var MessagesAlert = require.async('./message_alert');
    var TweetBoxView = require('./tweetbox');
    var TweetsView = Backbone.View.extend({
        tagName:'li',
        className:'.media',
        events:{
            'click .icon-remove':'delete'
        },
        initialize:function(){
            this.textLength = this.$('.tweet-counter');
            this.saveButton = this.$('.icon-save');
            this.listenTo(this.model, 'change:text', this.render);
        },
        render:function(){
            CommonTweetView.textLengthTips(
                this.textLength,this.model.get('text'),
                this.disable,this.enable
            );
        },
        disable:function(){
            this.saveButton.addClass('hide');
        },
        enable:function(){
            this.saveButton.removeClass('hide')
        },
        remove:function(id,dialog){
            $.post("/del/" + id,function(res){
                if(res) {
                    dialog.modal("hide");
                    $.when(this.$el.addClass('animate-hide fast_hide')).done(function(){
                        setTimeout(function(){
                            var dfd = $.Deferred();
                            this.$el.remove();
                            new MessagesAlert({
                                text:"你的推文已删除。",
                                duration:1000,
                                className:"alert-tips"
                            });
                            TweetBoxView.tweetCount.text(parseInt(tweetCount.text()) - 1);
                            return dfd.resolve();
                        },300)
                    }).done(function(){
                            if (this.model.get('backup')){
                                setTimeout(function(){
                                    TweetBoxView.model.save(_.extend({},this.model,{updated:true}));
                                    TweetBoxView.$editor.html(this.model.get('html')).focus();
                                    //alert tips消失后再恢复
                                    this.model.destroy();
                                },1000)
                            }
                        })
                    dialog.remove();
                    dialog = null;

                }
            });
        },
        delete:function(e){
            e.preventDefault();
            var postID = this.el.id;
            var tweetBoxState = function(){
                return this.model.get("backup") ? {
                    enable:function(){
                        TweetBoxView.editor.contentEditable = true;
                        TweetBoxView.editor.focus();
                    },
                    disable:function(){
                        TweetBoxView.editor.contentEditable = false;
                    }
                } : {
                    enable:function(){},
                    disable:function(){}
                }
            }();
            if (!this.model.get('deleteDialog')) {
                this.model.set({
                    deleteDialog:CommonTweetView.tweetDialog("delete-tweet-dialog-" + postID,"确定要删除这条推文吗?",post.html(),"删除",function(){
                        actionCallback(post,postID,deleteDialog[postID])
                    })
                });
            }else if(updatePOST){
                deleteDialog[postID] = tUtil.tweetDialog("delete-tweet-dialog-" + postID,"确定要删除这条推文吗?",post.html(),"删除",true,function(){
                    actionCallback(post,postID,deleteDialog[postID])
                });
            }else{
                deleteDialog[postID].modal();
            }
        }

    })
    module.exports = TweetsView;
})