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
    var  sessionPost = {},
        links = twitterText.extractUrls(content);
    sessionPost.content = links.length ?
        twitterText.autoLinkEntities(
            content,twitterText.extractUrlsWithIndices(content),wraplinkAttrs
        ) : content;
    if (links.every(function(i){return i.length > 19}) ) {
        links.forEach(function(i){
            sessionPost.content =
                sessionPost.content.replace(i,function(m,k){
                    return k === 2 ? m.slice(0,20) : m
                })
        })
    }

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

exports.postTemplate = require('fs').readFileSync('./views/post.jade','utf8');