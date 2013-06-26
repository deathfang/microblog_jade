define(function(require, exports, module) {
    var twitterText = require('twitterText');
    var _ = require('_');
    var messageLength = function (text) {
        twitterText.extractUrls(text).forEach(function(i){
            text =  text.replace(i.toString(),'填充填充填充填充填充填充填充填二十个汉字');
        })
        return text.length;
//        text = text.replace(urlRxp,'填充填充填充填充填充填充填充填二十个汉字');
//        return Math.ceil((text.replace(/[^\u0000-\u00ff]/g,"aa").trim().length)/2);
//        twitter的 空白也算字符
    }

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
                _.each(TimesMS,function(v,k){
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
        REG_NOHTML : /<\S[^><]*>/g,
        messageLength:messageLength,
        timer:timer
    }
})