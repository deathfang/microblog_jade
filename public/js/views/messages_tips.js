define(function(require, exports, module){
    require.async('../../lib/jquery-plugins/bootstrap-alert.js');
    var Backbone = require('backbone');
    var $ = require('jquery');
    var messageTmpl = require('../templates/message_alert.html');
    var messagesAlert = Backbone.View.extend({
        template: _.template(messageTmpl),
        initialize:function(){
            this.render()
        },
        render:function(){
            this.$el.html(template({text:this.text})).append($("body"));
            if (this.className) {
                this.$el.addClass(this.className);
            }
            setTimeout(function() {
                this.$el.alert("close")
            }, this.duration)
            return this;
        }
    });
    module.exports = messagesAlert;
})