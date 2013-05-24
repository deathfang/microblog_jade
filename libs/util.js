var xss = require('xss');
var moment = require('moment');
var jade =  require('jade');
moment.lang('zh-cn');
require('./moment.twitter.js');

exports.postFormat = function(content,time){
    var postLInkTmpl = 'a(href=url,title=url,target="_blank",rel="nofollow") #{text}';
    var postTimeTmpl = 'a.time(href="",title=longtime,data-time=dateTime) #{time}';
    var urlRxp = new RegExp("((news|telnet|nttp|file|http|ftp|https)://){1}(([-A-Za-z0-9]+(\\.[-A-Za-z0-9]+)*(\\.[-A-Za-z]{2,5}))|([0-9]{1,3}(\\.[0-9]{1,3}){3}))(:[0-9]*)?(/[-A-Za-z0-9_\\$\\.\\+\\!\\*\\(\\),;:@&=\\?/~\\#\\%]*)*","gi");
    var tokens = {}, links = null,
        sessionPost = {},
        hasUrl = content.match(urlRxp);
    if (hasUrl) {
        links = function(match) {
            tokens.url = match;
            tokens.text = tokens.url.replace(/(http(s?):\/\/)?(www\.)?/, "");
            tokens.text.length > 19 && (tokens.text = tokens.text.slice(0,19) + "...")
            return jade.compile(postLInkTmpl)(tokens)
        }
    }
    sessionPost.content = hasUrl ? content.replace(urlRxp,links) : content;
    sessionPost.time = jade.compile(postTimeTmpl)({
        time:moment(time).twitter(),
        longtime:moment(time).format('L, h:mm a').replace(/\d\d/,''),
        dateTime:+time
    })
    return sessionPost;
};

exports.xss = function(html){
   return xss(html);
};

exports.merge = function () {
    var i      = 0,
        len    = arguments.length,
        result = {},
        key,
        obj;

    for (; i < len; ++i) {
        obj = arguments[i];

        for (key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                result[key] = obj[key];
            }
        }
    }

    return result;
};

exports.postTemplate = 'li.media.animate-hide(id=_id)\n    a.pull-left(href="/" + author)\n        strong.fullname #{author}\n        img.media-object.avatar(src="../img/avatar.png")\n    .media-body\n        !{time}\n        .post: p !{content}\n        .tweet-actions\n            span(title="删除").icon-remove.fade\n            span(title="编辑").icon-edit.fade\n            span(title="保存").icon-save.fade.hide';