define(function(require,exports,module){
    var Backbone = require('backbone');
    var $ = require('jquery');
    var UA = require('UA');
    var Common = require('./post_common_method');

    var tweetBox = require('../models/tweetBox');
    var tweetBoxView = Backbone.View.extend({
        el:'.tweet-box',
        events:{
            'focus .textbox':function(){}
        },
        initialize:function(){
            this.tweetCount = $('.stats li:first strong'),
            this.$editor = this.$(".textbox"),
            this.editor = this.$editor[0],
            this.textLength = this.$('.tweet-counter'),
            this.button = this.$('button');
            if (postEditor.text() !== "" && boxUpdated) {
                this.$el.addClass("uncondensed");
                this.$editor.focus();
                this.enable();
                Common.textLengthTips(this.textLength,this.modal.get('text'),function(){
                    this.disable()
                },function(){
                    this.enable()
                });
            }
        },
        condensed:function(){
            if (this.model.get('text').trim() === "") {
                this.$el.removeClass("uncondensed");
                this.$editor.html(this.model.PLACEHOLDER);
                this.model.save({boxUpdated:false})
            }
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
        }
    })
    module.exports = tweetBoxView;
})