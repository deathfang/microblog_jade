define(function(require,exports,module){
    require.async('lib/jquery-plugins/bootstrap-transition');
    require.async('lib/jquery-plugins/bootstrap-modal.js');
    require.async("lib/jquery-plugins/drag");
    var Backbone = require('backbone');
    var $ = require('jquery');
    var util = require('../util');
    var modalCompiled  = require('../templates/modal.handlebars');
    var twitterText = require('twitterText');
    var body = $('body');
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
        withRichEditor:function(){
            var currentRange = window.getSelection().getRangeAt(0);
            var currentNode = currentRange.endContainer;
            var currentHTML = currentNode.previousSibling && currentNode.previousSibling.innerHTML || currentNode.data;
            var cursorPosition = this.htmlRich.getSelectionOffsets();
            var html,urls;
            if (twitterText.extractUrls(currentHTML).length && !this.$editor.attr("data-in-composition")){

                //过滤<a..> </a> a的文本和其他url文本继续转换 焦点保持在url最后
                html = this.$editor.html().replace(/<a[^><]*>|<\/a>/g,"");
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
                twitterText.extractUrls(this.$editor.text()).forEach(function(item){
                    emPosition -= 20 - item.length;
                })
                //仅创建一个em 焦点需要定位到em后面
                this.$editor.html(this.$editor.html().replace(/<\/*em>/g,''));
                //计算几个换行符 Firefox查找br
                var lineCount = this.editor.innerText ? this.editor.innerText.length - this.$editor.text().length :
                    this.$editor.find("br").length;
                this.htmlRich.emphasizeText([
                    emPosition + (
                        //目标为tweetBox
                        this.$editor.hasClass('textbox') ?
                            //是否有换行情况细节计算 后面加减 -1 -2原因不明 火狐-1 webkit -2
                            (lineCount ? (this.editor.innerText ? lineCount - 2: lineCount - 1): 0 ) :
                            (lineCount ? lineCount - 1: 0 )
                        ),
                    Number.MAX_VALUE
                ]);
                this.$editor.html(
                    this.$editor.html().replace('</em>','') + '</em>'
                )
                this.htmlRich.setSelectionOffsets([parseInt(cursorPosition)]);
            }
            this.saveEditData();
        },
        tweetDialog : function(attributes,resize,disable,enable,callback){
            attributes.itemHTML = attributes.itemHTML.replace(/<div\sclass=\"tweet-actions\".+div>/,"");
            var dialog = $(modalCompiled(attributes));
            //测试初次弹层显示时监听show shown无效
            dialog.modal().css({marginTop:-dialog.outerHeight()/2 + "px"}).addClass('fade_in');
            body.addClass('modal-enabled');

//            //回车确认删除时 tweet-text.js 焦点会引发错误 contentEditable = false修复
//            tweetBoxState.disable();
            disable();
            dialog.on("shown",function(){
                //tweet编辑时 内容改变 重新计算
                resize === true && dialog.css({marginTop:-dialog.outerHeight()/2 + "px"});
                body.addClass('modal-enabled');
//                tweetBoxState.disable();
                disable();
            })
            dialog.on("hidden",function(){
                body.removeClass('modal-enabled');
//                tweetBoxState.enable();
                enable();
            })
            var actionButton = dialog.find('[data-action]').on('click.delDialog',callback);
            dialog.keyup(function(e){
                e.keyCode === 13 && actionButton.trigger('click.delDialog');
            })
            return dialog;
        }
    });
    module.exports = new CommonTweetView
})