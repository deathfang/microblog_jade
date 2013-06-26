define(function(require,exports,module){
    var Backbone = require('backbone');
    var $ = require('jquery');
    var UA = require.async('UA');
    var htmlText = require('html-text');
    var util = require('../util');
    var commonView = require('./post_commonView_method');
    var messagesAlert = require('./message_alert');
    var tweetbox = new (require('../models/tweetbox'));
    var tweetBoxView = Backbone.View.extend({
        el:'.tweet-box',
        events:{
            'focus .textbox':function(){
                this.$editor.addClass("uncondensed");
                if (tweetbox.get('updated')) {
                    this.$editor.html("");
                    this.htmlRich.setSelectionOffsets([0])
                }
//                focusEditor()
            },
            'blur .textbox':'toggleCondensed',
            'keydown .textbox':'updateOnEnter'
        },
        initialize:function(){
            this.PLACEHOLDER = '<div>撰写新推文...</div>',
            this.tweetCount = $('.stats li:first strong'),
            this.$editor = this.$(".textbox"),
            this.editor = this.$editor[0],
            this.textLength = this.$('.tweet-counter'),
            this.button = this.$('button');

            this.listenTo(tweetbox,'reset',this.render);
            this.listenTo(tweetbox,'change:text',this.render);

            tweetbox.fetch();

            if (this.getText()) {
                this.getText().replace(util.REG_NOHTML,'').replace(/&nbsp;/g,"").trim()
                && this.$editor.html(this.getText());
                if (tweetbox.get('updated')) {
                    this.toggleCondensed();
                    this.editor.focus();
                }
            }
        },
        render:function(){
            commonView.textLengthTips(
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
            tweetbox.get('text')
        },
        toggleCondensed:function(){
            this.$el.toggleClass("uncondensed",this.isWhitespace());
            this.isWhitespace() && this.$editor.html(this.PLACEHOLDER);
        },
        isWhitespace:function(){
            return !!this.getText().trim()
        },
        updateOnEnter:function(e){
            //Mac习惯用command
            (e.metaKey || e.ctrlKey) && e.keyCode === 13 &&
                !this.button.attr("disabled") && this.$('form').trigger('submit');
        },
        htmlRich:htmlText(this.editor,UA)

    })
    module.exports = tweetBoxView;
})