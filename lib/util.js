var xss = require('xss');
var moment = require('moment');
var jade =  require('jade');
moment.lang('zh-cn');
require('./moment.twitter.js');
var twitterText = require('./twitter-text.js');

exports.postFormat = function(content,time){
    var postTimeTmpl = 'a.time(href="",title=longtime,data-time=dateTime) #{time}';
    var postLinkTmpl= 'a(rel="nofollow",href=url,title=url,target="_blank") #{text}';
    var  sessionPost = {},
        links = twitterText.extractUrls(content);
        sessionPost.content = content;
        links.forEach(function(i){
            sessionPost.content =
                sessionPost.content.replace(i,function(m){
                    return jade.compile(postLinkTmpl)({
                        url: m.match(/^http(s*):\/\//) ? m : 'http://' + m,
                        text: m.length > 20 ? m.slice(0,20) + '...' : m
                    })
                })
        })
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