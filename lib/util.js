var xss = require('xss');
var moment = require('moment');
var jade =  require('jade');
moment.lang('zh-cn');
require('./moment.twitter.js');
var twitterText = require('./twitter-text.js');
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


exports.postFormat = function(content,time){
    var postTimeTmpl = 'a.time(href="",title=longtime,data-time=dateTime) #{time}';
    var  sessionPost = {}
    sessionPost.content = twitterText.extractUrls(content).length ?
        twitterText.autoLinkEntities(
            content,twitterText.extractUrlsWithIndices(content),wraplinkAttrs
        ) : content;
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
//非深度嵌套
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
