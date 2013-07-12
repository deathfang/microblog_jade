define(function(require, exports, module){
    require.async('../../lib/jquery-plugins/bootstrap-alert.js');
    var Backbone = require('backbone');
    var $ = require('jquery');
    var messageTmpl = require('../templates/message_alert.handlebars');
    var MessagesAlert = Backbone.View.extend({
        template: _.template(messageTmpl),
        initialize:function(options){
            this.text = options.text;
            this.duration = options.duration;
            this.newClassName = options.newClassName || 'alert-tips';
            this.render()
        },
        render:function(){
            this.$el.html(template({text:this.text})).append($("body"));
            this.$el.addClass(this.newClassName)
            setTimeout(function() {
                this.$el.alert("close")
            }, this.duration)
            return this;
        }
    });
    module.exports = MessagesAlert;
})