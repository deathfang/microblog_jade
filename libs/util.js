var moment = require('moment');
var jade =  require('jade');
moment.lang('zh-cn');
require('./moment.twitter.js');

exports.postFormat = function(post,time){
    var postLInkTmpl = 'a(href=url,title=url,target="_blank",rel="nofollow") #{text}';
    var postTimeTmpl = 'a.time(href="",title=longtime) #{time}';
    var urlRxp = new RegExp("((news|telnet|nttp|file|http|ftp|https)://){1}(([-A-Za-z0-9]+(\\.[-A-Za-z0-9]+)*(\\.[-A-Za-z]{2,5}))|([0-9]{1,3}(\\.[0-9]{1,3}){3}))(:[0-9]*)?(/[-A-Za-z0-9_\\$\\.\\+\\!\\*\\(\\),;:@&=\\?/~\\#\\%]*)*","gi");
    var tokens = {}, links = null,
        sessionPost = {},
        hasUrl = post.match(urlRxp);
    if (hasUrl) {
        links = function(match) {
            tokens.url = match;
            tokens.text = tokens.url.replace(/(http(s?):\/\/)?(www\.)?/, "");
            tokens.text.length > 19 && (tokens.text = tokens.text.slice(0,19) + "...")
            return jade.compile(postLInkTmpl)(tokens)
        }
    }
    sessionPost.post = hasUrl ? post.replace(urlRxp,links) : post;
    sessionPost.time = jade.compile(postTimeTmpl)({
        time:moment(time).twitter(),
        longtime:moment(time).format('L, h:mm a').replace(/\d\d/,'')
    })
    return sessionPost;
}