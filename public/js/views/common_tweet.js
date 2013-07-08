define(function(require,exports,module){
    var $ = require('jquery');
    var util = require('../util');
    var twitterText = require('twitterText');
    var CommonTweetView = Backbone.View.extend({
        initialize:function(){

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
        },
        withRichEditor:function(model){
            this.saveData();
            var currentRange = window.getSelection().getRangeAt(0);
            var currentNode = currentRange.endContainer;
            var currentHTML = currentNode.previousSibling && currentNode.previousSibling.innerHTML || currentNode.data;
//            var htmlRich = htmlText(oPostEditor,UA);
            var cursorPosition = this.htmlRich.getSelectionOffsets();
            var html,urls;
            if (twitterText.extractUrls(currentHTML).length && !this.$editor.attr("data-in-composition")){

                //过滤<a..> </a> a的文本和其他url文本继续转换 焦点保持在url最后
                html = model.get('html').replace(/<a[^><]*>|<\/a>/g,"");
                urls = twitterText.extractUrlsWithIndices(html);
                this.$editor.html(
                    twitterText.autoLinkEntities(
                        html,urls,
                        {
                            urlTarget: "_blank",
                            rel:"nofollow"
                        }
                    )
                )
                this.htmlRich.setSelectionOffsets([parseInt(cursorPosition) + 1])
            }

            if (this.textLength.text() < 0 && !this.$editor.attr("data-in-composition")) {
                var emPosition = 140;
                twitterText.extractUrls(model.get('text')).forEach(function(item){
                    emPosition -= 20 - item.length;
                })
                //仅创建一个em 焦点需要定位到em后面
                this.$editor.html(model.get('html').replace(/<\/*em>/g,''));
                //计算几个换行符 Firefox查找br
                var lineCount = this.editor.innerText ? this.editor.innerText.length - model.get('text').length :
                    this.$editor.find("br").length;
                this.htmlRich.emphasizeText([
                    emPosition + (
                        //目标为tweetBox
                        this.$editor.hasClass('textbox') ?
                            //是否有换行情况细节计算 后面加减 -1 -2原因不明 火狐-1 webkit -2
                            (lineCount ? (oPostEditor.innerText ? lineCount - 2: lineCount - 1): 0 ) :
                            (lineCount ? lineCount - 1: 0 )
                        ),
                    Number.MAX_VALUE
                ]);
                this.$editor.html(
                    model.get('html').replace('</em>','') + '</em>'
                )
                this.htmlRich.setSelectionOffsets([parseInt(cursorPosition)]);

            }
        }
    });
    module.exports = new CommonTweetView
})