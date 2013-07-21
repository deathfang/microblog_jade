define(function(require,exports,module){
    require.async('lib/jquery-plugins/bootstrap-tooltip.js');
    var Backbone = require('backbone');
    var $ = require('jquery');
    var UA = require.async('UA');
    var htmlText = require('html-text');
    var util = require('../util');
    var CommonTweetView = require('./common_tweet');
    var MessagesAlert = require.async('./messages_tips');
    var tweetCount = $(".dashboard .stats li:first strong");
    var TweetView = Backbone.View.extend({
        events:{
            'click .icon-remove':'delClick',
            'click .icon-edit':'edit',
            'click .icon-save':'preSave',
            'keydown .post p':'updateOnEnter',
            'keyup.withRichEditor .post p':'withRichEditor',
            'paste.withRichEditor .post p':'withRichEditor'
        },
        initialize:function(options){
            this.el = options.el;
            this.$editor = this.$('.post p');
            this.editor = this.$editor[0];
            this.textLength = this.$('.tweet-counter');
            this.saveButton = this.$('.icon-save');
            this.oldText = this.model.get('text');
            this.editorContainer  = this.$editor.parent();
            this.htmlRich = htmlText(this.editor,UA);
            this.listenTo(this.model, 'change:text', this.render);
        },
        render:function(){
            !this.$editor.attr("data-in-composition") &&
            CommonTweetView.textLengthTips(
                this.textLength,this.model.get('text'),
                this.disable.bind(this),this.enable.bind(this)
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
                            tweetCount.text(parseInt(tweetCount.text()) - 1);
                            return dfd.resolve();
                        }.bind(this),300)
                    }).done(function(){
                            if (this.model.get('backup')){
                                setTimeout(function(){
                                    this.trigger('restore');
                                }.bind(this),1000)
                            }
                        }.bind(this));
                    this.model.destroy();
                    this.deleteDialog.remove();
                }
            }.bind(this));
        },
        delDialogAttrs:function(){
            return {
                id:'delete-tweet-dialog-' + this.el.id,
                title:'确定要删除这条推文吗?',
                itemHTML:this.model.get('html'),
                action:'删除'
            }
        },
        tweetBoxState :function(model){
            var boxEditor = document.querySelector('.tweet-box .textbox');
            return model.get("backup") ? {
                enable:function(){
                    boxEditor.contentEditable = true;
                    boxEditor.focus();
                },
                disable:function(){
                    boxEditor.contentEditable = false;
                }
            } : {
                enable:function(){},
                disable:function(){}
            }
        },
        delClick:function(e){
            e.preventDefault();
            var tweetBoxState = this.tweetBoxState(this.model);
            if (!this.deleteDialog) {
                this.deleteDialog = CommonTweetView.tweetDialog(
                    this.delDialogAttrs(),false,
                    tweetBoxState.disable,tweetBoxState.enable,
                    function(){
                        this.delete(this.el.id,this.deleteDialog)
                    }.bind(this)
                )
            }else if(this.model.get('updated')){
                this.deleteDialog = CommonTweetView.tweetDialog(
                    this.delDialogAttrs(),false,
                    tweetBoxState.disable,tweetBoxState.enable,
                    function(){
                        this.delete(this.el.id,this.deleteDialog)
                    }.bind(this)
                );
            }else{
                this.deleteDialog.modal();
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
            $.post('/edit/'+ this.el.id,{post:CommonTweetView.getTextWrap(this.editor)},function(res){
                if (res.content) {
                    this.$editor.html(res.content);
                    this.editorContainer.prev().replaceWith(res.time);
                    var newPostTime = $('#' + this.el.id + ' .time');
                    util.timer(newPostTime);
                    this.$editor.attr({contenteditable:false}).blur();
                    this.saveButton.addClass("hide");
                    this.textLength.addClass("hide");
                    !this.saveLabel && (this.saveLabel =
                        $('<span class="modal hide fade">保存成功</span>').appendTo(this.editorContainer)
                    );
                    this.saveLabel.modal({backdrop:false})
                    this.saveLabel.on('shown',function(){
                        setTimeout(function(){
                            this.modal('hide');
                        },1000)
                    }.bind(this));
                }
            }.bind(this));
        },
        updateOnEnter:function(e){
            if ((e.metaKey || e.ctrlKey) && e.keyCode === 13){
                this.model.get('updated') && this.saveButton.is(':visible') ? this.save() : this.textWarn()
            }
        },
        textWarn:function(){
            this.editorContainer.tooltip({
                title:"修改下嘛( ´◔ ‸◔`)！",
                trigger:"manual"
            }).tooltip('show');
            setTimeout(function(){
                this.editorContainer.tooltip('hide');
            }.bind(this),1500)
        },
        saveEditData:function(){
            this.model.set({
                text:this.$editor.text(),
                html:this.$editor.html()
            });
            this.model.set({
                updated:this.oldText !== this.model.get('text') && this.model.get('text').trim()
            })
        },
        withRichEditor:function(){
            CommonTweetView.withRichEditor.bind(this)()
        }
    })
    module.exports = TweetView;
})