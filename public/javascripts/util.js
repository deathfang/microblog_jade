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

    var modalTmpl = '<div id="{id}" class="modal tweet-dialog hide" tabindex="-1" role="dialog" aria-hidden="true">\
                      <div class="modal-header" id="{id}-header">\
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

    var tweetDialog = function(id,title,itemHTML,action,resize,callback){
        var callback = typeof resize === "function" ? resize : callback;
        itemHTML.replace(actionHTML,"").replace(/<span.+保存成功.+\/span>/,"");
        var dialog = $(sub(modalTmpl,{
            id:id,title:title,itemHTML:itemHTML,action:action
        }));
        //测试初次弹层显示时监听show shown无效
        dialog.modal().css({marginTop:-dialog.outerHeight()/2 + "px"})
            .addClass('fade_in').dragdrop({anchor: id + "-header"});
        body.addClass('modal-enabled');
        dialog.on("shown",function(){
            //tweet编辑时 内容改变 重新计算
            resize === true && dialog.css({marginTop:-dialog.outerHeight()/2 + "px"});
            body.addClass('modal-enabled');
        })
        dialog.on("hidden",function(){
            body.removeClass('modal-enabled')
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
