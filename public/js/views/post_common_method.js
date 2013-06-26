define(function(require,exports,module){
    var util = require('../util');
    var CommonView = Backbone.View.extend({
        initialize:function(){
            $(document).on("compositionstart", function(e){
                e.target.setAttribute("data-in-composition", "true")
            });
            $(document).on("compositionend", function(e){
                e.target.removeAttribute("data-in-composition")
            });
        },
        textLengthTips : function(msgtips,val,disable,enable){
            var msglen = util.messageLength(val),
                tips = 140-msglen;
            if (val == "") {
                disable();
                msgtips.removeClass("text-warn");
            }
            else if (msglen <= 140) {
                enable();
                msglen >= 130 ? msgtips.addClass("text-warn") : msgtips.removeClass("text-warn");
            } else {
                msgtips.addClass("text-warn");
                disable();
            }
            msgtips.text(tips);
        },
        getTextWrap:function(element){
            //contenteditable下换行有div innerText有换行 jQuery text()和textContent无
            //Firefox不支持innerText 单独处理
            return element.innerText ?
                element.innerText :
                $(element).html().replace(/<br>/g,"&#10;").replace(util.REG_NOHTML,'')
        }
    });
    module.exports = new CommonView
})