define(function(require,exports,module){
    var Backbone = require('backbone');
    var $ = require('jquery');
    var UA = require.async('UA');
    var htmlText = require('html-text');
    var util = require('../util');
    var commonView = require('./common_post');
    var messagesAlert = require('./message_alert');
    var tweetbox = new (require('../models/tweetbox'));
    var tweetBoxView = Backbone.View.extend({
        el:'.tweet-box',
        events:{
            'focus .textbox':'openEdit',
            'blur .textbox':'close',
            'keydown .textbox':'updateOnEnter',
            'keyup.withRichEditor .textbox':'',
            'paste.withRichEditor .textbox':''
        },
        initialize:function(){
            this.PLACEHOLDER = '<div>撰写新推文...</div>',
            this.tweetCount = $('.stats li:first strong'),
            this.$editor = this.$(".textbox"),
            this.editor = this.$editor[0],
            this.textLength = this.$('.tweet-counter'),
            this.button = this.$('button');
            //首次load需要reset
            this.listenTo(tweetbox,'reset',this.render);
            this.listenTo(tweetbox,'change',this.render);

            tweetbox.fetch();

            this.loadFocus();
        },
        render:function(){
            commonView.textLengthTips(
                this.textLength,this.getText(),
                this.disable,this.enable
            );
            this.$editor.html(tweetbox.get('html'));
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
            tweetbox.get('text')
        },
        toggleCondensed:function(){
            this.$el.toggleClass("uncondensed",!tweetbox.get('updated'));
        },
        openEdit:function(){
            this.toggleCondensed();
            !tweetbox.get('updated') && this.$editor.html('');
        },
        close:function(){
            this.toggleCondensed();
            !tweetbox.get('updated') && this.$editor.html(this.PLACEHOLDER);
        },
        isWhitespace:function(){
            return !!this.getText().trim()
        },
        updateOnEnter:function(e){
            //Mac习惯用command
            (e.metaKey || e.ctrlKey) && e.keyCode === 13 &&
                !this.button.attr("disabled") && this.$('form').trigger('submit');
        },
        htmlRich:htmlText(this.editor,UA),
        loadFocus:function(){
            if (tweetbox.get('updated')) {
                this.$editor.focus(function(){
                    this.htmlRich.setSelectionOffsets([
                        commonView.getTextWrap(this.editor).length
                    ])
                }).focus();
            }
        }

    })
    module.exports = tweetBoxView;
})