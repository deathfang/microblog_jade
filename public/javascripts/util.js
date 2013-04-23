var tUtil = function(){
    var body = $("body");
// 微博字数计算规则 汉字 1 英文 0.5 网址 20 后台截取 除去首尾空白
    var urlRxp = new RegExp("((news|telnet|nttp|file|http|ftp|https)://){1}(([-A-Za-z0-9]+(\\.[-A-Za-z0-9]+)*(\\.[-A-Za-z]{2,5}))|([0-9]{1,3}(\\.[0-9]{1,3}){3}))(:[0-9]*)?(/[-A-Za-z0-9_\\$\\.\\+\\!\\*\\(\\),;:@&=\\?/~\\#\\%]*)*","gi");

    var SUBREGEX = /\{\s*([^|}]+?)\s*(?:\|([^}]*))?\s*\}/g;

    var msglen = function (text) {
        text = text.replace(urlRxp,'填充填充填充填充填充填充填充填二十个汉字');
        return Math.ceil((text.replace(/[^\u0000-\u00ff]/g,"aa").trim().length)/2);
    }
    var linkTmpl = '<a href="{url}" title="{url}" target="_blank" rel="nofollow">{text}</a>';

    var messagesTmpl = '<div class="alert alert-messages fade in"><button type="button" data-dismiss="alert" class="close">&times;</button>{text}</div>';

    var modalTmpl = '<div id="{id}" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="{id}Label" aria-hidden="true">\
                      <div class="modal-header">\
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>\
                        <h3>{title}</h3>\
                      </div>\
                      <div class="modal-body">{itemHTML}</div>\
                      <div class="modal-footer">\
                        <button class="btn" data-dismiss="modal">取消</button>\
                        <button class="btn btn-primary">{action}</button>\
                      </div>\
                    </div>';

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

    var tweetDialog = function(id,title,itemHTML,action){
        return $(sub(modalTmpl,{
            id:id,title:title,itemHTML:itemHTML,action:action
        })).modal()
    }


    function isUndefined(o) {
        return typeof o === 'undefined';
    };
    function sub(s, o) {
        return s.replace ? s.replace(SUBREGEX, function (match, key) {
            return isUndefined(o[key]) ? match : o[key];
        }) : s;
    };

    function wrapLinks(match){
        var tokens = {};
        tokens.url = tokens.text = match;
//        tokens.text = tokens.url.replace(/(http(s?):\/\/)?(www\.)?/, "");
//        tokens.text.length > 19 && (tokens.text = tokens.text.slice(0,19) + "...")
        return sub(linkTmpl, tokens);
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
            this.add = function(){
                button.addClass(style)
            }
            this.remove = function(){
                button.removeClass(style)
            }
        }
    }
   return {
       urlRxp:urlRxp
      ,msglen:msglen
      ,wrapLinks:wrapLinks
      ,messagesTips:messagesTips
      ,tweetDialog:tweetDialog
      ,ButtonStatus:ButtonStatus
   }
}()

