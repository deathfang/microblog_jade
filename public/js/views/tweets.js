define(function(require,exports,module){
    require.async('../../lib/jquery-plugins/bootstrap-tooltip.js');
    var Backbone = require('backbone');
    var $ = require('jquery');
    var util = require('../util');
    var CommonTweetView = require('./common_tweet');
    var MessagesAlert = require.async('./message_alert');
    var TweetBoxView = require('./tweetbox');
    var tweetBoxState = function(model){
        return model.get("backup") ? {
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
    };
    var TweetsView = Backbone.View.extend({
        tagName:'li',
        className:'.media',
        events:{
            'click .icon-remove':'preDelete',
            'click .icon-edit':'edit',
            'click .icon-save':'preSave',
            'keydown .post p':'updateOnEnter',
            'keyup.withRichEditor .post p':'withRichEditor',
            'paste.withRichEditor .post p':'withRichEditor'
        },
        initialize:function(){
            this.$editor = this.$('.post p');
            this.editor = this.$editor[0];
            this.textLength = this.$('.tweet-counter');
            this.saveButton = this.$('.icon-save');
            this.oldText = this.model.get('text');
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
        delete:function(id,dialog){
            $.post("/del/" + id,function(res){
                if(res) {
                    dialog.modal("hide");
                    $.when(this.$el.addClass('animate-hide fast_hide')).done(function(){
                        setTimeout(function(){
                            var dfd = $.Deferred();
                            this.remove();
                            new MessagesAlert({
                                text:'你的推文已删除',
                                duration:1000
                            });
                            TweetBoxView.tweetCount.text(parseInt(tweetCount.text()) - 1);
                            return dfd.resolve();
                        },300)
                    }).done(function(){
                            if (this.model.get('backup')){
                                setTimeout(function(){
                                    TweetBoxView.model.save(_.extend({},this.model.toJSON(),{updated:true}));
                                    TweetBoxView.editor.focus();
                                    //alert tips消失后再恢复
                                    this.model.destroy();
                                },1000)
                            }
                        })
                    dialog.remove();
                    dialog.off('click');
                }
            });
        },
        delDialogAttrs:function(){
            return {
                id:'delete-tweet-dialog-' + this.id,
                title:'确定要删除这条推文吗?',
                itemHTML:this.model.get('html'),
                action:'删除'
            }
        },
        preDelete:function(e){
            e.preventDefault();
            var tweetBoxState = tweetBoxState(this.model);
            if (!this.model.get('deleteDialog')) {
                this.model.set({
                    deleteDialog:CommonTweetView.tweetDialog(
                        this.delDialogAttrs(),false,
                        tweetBoxState.disable,tweetBoxState.enable,
                        function(){
                            this.delete(this.id,this.model.get('deleteDialog'))
                        }
                    )
                });
            }else if(this.model.get('updated')){
                this.model.set({
                    deleteDialog:CommonTweetView.tweetDialog(
                        this.delDialogAttrs(),true,
                        tweetBoxState.disable,tweetBoxState.enable,
                        function(){
                            this.delete(this.id,this.model.get('deleteDialog'))
                        }
                    )
                });
            }else{
                this.model.get('deleteDialog').modal();
            }
        },
        edit:function(e){
            e.preventDefault();
            this.$editor.attr("contenteditable",true).focus();
        },
        preSave:function(e){
            e.preventDefault();
            this.model.get('updated') ? this.save() : this.textWarn();
        },
        save:function(){
            $.post('/edit/'+ this.id,{post:CommonTweetView.getTextWrap(this.editor)},function(res){
                if (res.content) {
                    this.$editor.html(res.content);
                    this.$editor.find('.time').replaceWith(res.time);
                    var newPostTime = $('#' + postID + ' .time');
                    util.timer(newPostTime);
                    this.$editor.attr({contenteditable:false}).blur();
                    this.saveButton.addClass("hide");
                    this.textLength.addClass("hide");
                    var savelabel;
                    if (postEditor.find('.modal').length < 1) {
                        savelabel = $('<span class="modal hide fade">保存成功</span>').appendTo(postEditor.parent());
                    }else {
                        savelabel = postEditor.find('.modal');
                    }
                    savelabel.modal({backdrop:false})
                    savelabel.on('shown',function(){
                        saveButton.unbind('click');
                        postEditor.unbind('keydown');
                        setTimeout(function(){
                            savelabel.modal('hide');
                        },1000)
                    });
                    storePostText.backup(postID,postEditor.html());
                }
            });
        },
        updateOnEnter:function(e){
            if ((e.metaKey || e.ctrlKey) && e.keyCode === 13){
                this.model.get('updated') && this.saveButton.is(':visible') ? this.save() : this.textWarn()
            }
        },
        textWarn:function(){
            var post = this.$editor.parent();
            post.tooltip({
                title:"修改下嘛( ´◔ ‸◔`)！",
                trigger:"manual"
            }).tooltip('show');
            setTimeout(function(){
                post.tooltip('hide');
            },1500)
        },
        saveDate:function(){
            this.model.set({
                text:this.$editor.text(),
                html:this.$editor.html()
            });
            this.model.set({
                updated:this.oldText !== this.model.get('text') && this.model.get('text').trim()
            })
        },
        withRichEditor:function(){
            CommonTweetView.withRichEditor.bind(this,this.model)()
        }
    })
    module.exports = TweetsView;
})