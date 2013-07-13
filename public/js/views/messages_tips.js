define(function(require, exports, module){
    require.async('../../lib/jquery-plugins/bootstrap-alert.js');
    var Backbone = require('backbone');
    var $ = require('jquery');
    var messageCompiled = require('../templates/message_alert.handlebars');
    var MessagesAlert = Backbone.View.extend({
        template: messageCompiled,
        initialize:function(options){
            this.text = options.text;
            this.duration = options.duration;
            this.newClassName = options.newClassName || 'alert-tips';
            this.render()
        },
        render:function(){
            this.$el.html(this.template({text:this.text})).appendTo($("body"));
            this.$el.addClass(this.newClassName)
            setTimeout(function() {
                this.$el.alert("close")
            }, this.duration)
            return this;
        }
    });
    module.exports = MessagesAlert;
})