define(function(require, exports, module) {
    var $ = require('jquery');
    var twitterText = require('twitterText');
    require.async("lib/jquery-plugins/bootstrap.min");
    require.async("lib/jquery-plugins/drag");
//var tUtil = function(){
    var body = $("body");
// 微博字数计算规则 汉字 1 英文 0.5 网址 20 后台截取 除去首尾空白
//    var urlRxp = new RegExp("((news|telnet|nttp|file|http|ftp|https)://){1}(([-A-Za-z0-9]+(\\.[-A-Za-z0-9]+)*(\\.[-A-Za-z]{2,5}))|([0-9]{1,3}(\\.[0-9]{1,3}){3}))(:[0-9]*)?(/[-A-Za-z0-9_\\$\\.\\+\\!\\*\\(\\),;:@&=\\?/~\\#\\%]*)*","gi");

    var SUBREGEX = /\{\s*([^|}]+?)\s*(?:\|([^}]*))?\s*\}/g;

    var messageLength = function (text) {
        twitterText.extractUrls(text).forEach(function(i){
            text =  text.replace(i.toString(),'填充填充填充填充填充填充填充填二十个汉字');
        })
        return text.length;
//        text = text.replace(urlRxp,'填充填充填充填充填充填充填充填二十个汉字');
//        return Math.ceil((text.replace(/[^\u0000-\u00ff]/g,"aa").trim().length)/2);
//        twitter的 空白也算字符
    }
//    var linkTmpl = '<a href="{url}" title="{url}" target="_blank" rel="nofollow">{text}</a>';

    var messagesTmpl = '<div class="alert alert-messages fade in"><button type="button" data-dismiss="alert" class="close">&times;</button>{text}</div>';

    var modalTmpl = '<div id="{id}" class="modal tweet-dialog hide" tabindex="-1" role="dialog" aria-hidden="true">\
                      <div class="modal-header" data-toggle="draggable" data-target="#{id}">\
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>\
                        <h3>{title}</h3>\
                      </div>\
                      <div class="modal-body media">{itemHTML}</div>\
                      <div class="modal-footer">\
                        <button class="btn" data-dismiss="modal">取消</button>\
                        <button class="btn btn-primary" data-action="active">{action}</button>\
                      </div>\
                    </div>';

    var actionHTML = '<div class="tweet-actions"><a href="" title="删除" class="icon-remove fade"></a><a href="" title="编辑" class="icon-edit fade"></a><a href="" title="保存" class="icon-save fade hide"></a></div>';

     var messagesTips = function(text,duration,className) {
        var alertMessages = $(sub(messagesTmpl, {
            text: text
        }))
        alertMessages.appendTo(body)
        if (className) {
            alertMessages.addClass(className);
        }
        setTimeout(function() {
            alertMessages.alert("close")
        }, duration)
    }

    var tweetBoxState = function(){
        var tweetBox = document.querySelector('.tweet-box .textbox');
        return sessionStorage.getItem("backup") ? {
            enable:function(){
                tweetBox.contentEditable = true;
                tweetBox.focus();
            },
            disable:function(){
                tweetBox.contentEditable = false;
            }
        } : {
            enable:function(){},
            disable:function(){}
        }
    };

    var tweetDialog = function(id,title,itemHTML,action,resize,callback){
        var callback = typeof resize === "function" ? resize : callback;
        itemHTML.replace(actionHTML,"").replace(/<span.+保存成功.+\/span>/,"");
        var dialog = $(sub(modalTmpl,{
            id:id,title:title,itemHTML:itemHTML,action:action
        }));
        //测试初次弹层显sessionStorage.getItem("backup") ? 示时监听show shown无效
        dialog.modal().css({marginTop:-dialog.outerHeight()/2 + "px"}).addClass('fade_in');
        body.addClass('modal-enabled');

        //回车确认删除时 tweet-text.js 焦点会引发错误 contentEditable = false修复
        tweetBoxState().disable();
        dialog.on("shown",function(){
            //tweet编辑时 内容改变 重新计算
            resize === true && dialog.css({marginTop:-dialog.outerHeight()/2 + "px"});
            body.addClass('modal-enabled');
            tweetBoxState().disable();
        })
        dialog.on("hidden",function(){
            body.removeClass('modal-enabled');
            tweetBoxState().enable();
        })
        var actionButton = dialog.find('[data-action]').on('click.delDialog',callback);
        dialog.keyup(function(e){
            e.keyCode === 13 && actionButton.trigger('click.delDialog');
        })
        return dialog;
    }


    function isUndefined(o) {
        return typeof o === 'undefined';
    };
    function sub(s, o) {
        return s.replace ? s.replace(SUBREGEX, function (match, key) {
            return isUndefined(o[key]) ? match : o[key];
        }) : s;
    };

//    function wrapLinks(match){
//        var tokens = {};
//        tokens.url = tokens.text = match;
////        tokens.text = tokens.url.replace(/(http(s?):\/\/)?(www\.)?/, "");
////        tokens.text.length > 19 && (tokens.text = tokens.text.slice(0,19) + "...")
//        return sub(linkTmpl, tokens);
//    }

    var wraplinkAttrs = {
//        hashtagClass: "twitter-hashtag pretty-link",
//        hashtagUrlBase: "/search?q=%23",
//        symbolTag: "s",
//        textWithSymbolTag: "b",
//        cashtagClass: "twitter-cashtag pretty-link",
//        cashtagUrlBase: "/search?q=%24",
//        usernameClass: "twitter-atreply pretty-link",
//        usernameUrlBase: "/",
//        usernameIncludeSymbol: !0,
//        listClass: "twitter-listname pretty-link",
        urlTarget: "_blank",
        rel:"nofollow",
//        suppressNoFollow: !0,
//        htmlEscapeNonEntities: !0
    }
    function ButtonStatus(button,style) {
        this.active = function(){
            button.removeClass("disabled").removeAttr("disabled");
            return this
        }
        this.disable = function(){
            button.addClass("disabled").attr("disabled",true);
            return this
        }
        if (style) {
            this.highlight = function(){
                button.addClass(style)
            }
            this.goOut = function(){
                button.removeClass(style)
            }
        }
    }
    var textLengthTips = function(msgtips,val,disable,enable){
        var msglen = messageLength(val),
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
//    function setFocusLast(node){
//        var selection = window.getSelection();
//        if (UA.webkit) {
//            range = document.createRange();
//            range.setStartAfter(node);
//            range.insertNode(document.createTextNode(''));
//            selection.removeAllRanges();
//            selection.addRange(range);
//        }
//        else{
//            //Firefox测试需selection.getRangeAt(0) 且 先insert 再set
//            range = selection.getRangeAt(0);
//            range.insertNode(document.createTextNode(''));
//            range.setStartAfter(node);
//        }
//    }
    var moment = require('lib/moment');
    function timer(postTime){
        var TimesMS = {
            day: 864e5,
            hour: 36e5,
            minute: 6e4,
            second: 1e3
        }
        var time = moment(postTime.data('time'));
        var interval = 5000,inc = 1,diff;
        function renderTime(){
            if (moment().diff(time)/(TimesMS.day) > 1) return;
            postTime.html(time.twitter());
            //时差小于1min定时
            if (moment().diff(time)/6e4 < 1) {
                diff = (60 - parseInt(postTime.html()))*1000;
                if (diff > interval) {
                    interval = interval *inc;
                    inc++;
                }else {
                    // 剩余到达1min的时长小于间隔时长时 需要按时更新到min  如：显示39s interval = 30s时要将interval = 60 -39
                    interval = diff;
                }
            }
            //根据当前时间单位设置定时器间隔
            else{
                $.each(TimesMS,function(k,v){
                    if (moment().diff(time)/v > 1){
                        interval = v;
                        return false;
                    }
                })
            }
            setTimeout(renderTime,interval);
        }
        renderTime();
    }
   module.exports = {
//       urlRxp:urlRxp
       textLengthTips:textLengthTips
      ,wraplinkAttrs:wraplinkAttrs
      ,messagesTips:messagesTips
      ,tweetDialog:tweetDialog
      ,ButtonStatus:ButtonStatus
//      ,setFocusLast:setFocusLast
      ,timer:timer
   }
//}()
})