var tUtil = {};
// 微博字数计算规则 汉字 1 英文 0.5 网址 20 后台截取 除去首尾空白
tUtil.urlRxp = new RegExp("((news|telnet|nttp|file|http|ftp|https)://){1}(([-A-Za-z0-9]+(\\.[-A-Za-z0-9]+)*(\\.[-A-Za-z]{2,5}))|([0-9]{1,3}(\\.[0-9]{1,3}){3}))(:[0-9]*)?(/[-A-Za-z0-9_\\$\\.\\+\\!\\*\\(\\),;:@&=\\?/~\\#\\%]*)*","gi");
tUtil.msglen = function (text) {
    text = text.replace(tUtil.urlRxp,'填充填充填充填充填充填充填充填二十个汉字');
    return Math.ceil(($.trim(text.replace(/[^\u0000-\u00ff]/g,"aa")).length)/2);
}
tUtil.linkTmpl = '<a href="{url}" title="{url}" target="_blank" rel="nofollow">{text}</a>';
tUtil.SUBREGEX = /\{\s*([^|}]+?)\s*(?:\|([^}]*))?\s*\}/g;
tUtil.isUndefined = function(o) {
    return typeof o === 'undefined';
};
tUtil.sub = function(s, o) {
    return s.replace ? s.replace(tUtil.SUBREGEX, function (match, key) {
        return tUtil.isUndefined(o[key]) ? match : o[key];
    }) : s;
};
tUtil.ButtonStatus = function (button,style) {
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
