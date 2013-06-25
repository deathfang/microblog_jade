define(function(require,exports,module){
    var util = require('../util');
    module.exports = {
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
        }
    }
})