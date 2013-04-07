var Util = {}
Util.msglen = function (text) { // 微博字数计算规则 汉字 1 英文 0.5 网址 20 后台截取 除去首尾空白
    text = text.replace(new RegExp("((news|telnet|nttp|file|http|ftp|https)://)?(([-A-Za-z0-9]+(\\.[-A-Za-z0-9]+)*(\\.[-A-Za-z]{2,5}))|([0-9]{1,3}(\\.[0-9]{1,3}){3}))(:[0-9]*)?(/[-A-Za-z0-9_\\$\\.\\+\\!\\*\\(\\),;:@&=\\?/~\\#\\%]*)*","gi"),'填充填充填充填充填充填充填充填二十个汉字');
    return Math.ceil(($.trim(text.replace(/[^\u0000-\u00ff]/g,"aa")).length)/2);
}

