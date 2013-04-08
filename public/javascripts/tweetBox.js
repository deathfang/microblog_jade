document.addEventListener('DOMContentLoaded',function(){
    var tweetBox = $(".tweet-box");
    var postInput = tweetBox.find('[name=post]');
    var oPostInput = postInput.get(0);
    var toolbar = tweetBox.find(".toolbar");
    var tweetButton = tweetBox.find(".tweet-button button");
    var msgtips = $(".tweet-counter");
    var condensed = function(){
        postInput.val() == "" && tweetBox.removeClass("uncondensed");
    }
    var textTips = function(val){
        var msglen = Util.msglen(val),
            tips = 140-msglen;
        if (msglen<=140) {
            tweetButton.removeClass("disabled").removeAttr("disabled")
            msgtips.removeClass("text-warn");
        } else {
            msgtips.addClass("text-warn");
            tweetButton.addClass("disabled").attr("disabled",true)
        }
        msgtips.text(tips);
    }
    if( store.enabled ) {
        storePostText = {
            set:function(){
                store.set('postText',postInput.val());
            },
            apply:function (){
                typeof store.get('postText') != 'undefined' && postInput.val(store.get('postText'));
            },
            clear:function(){
                store.clear('postText');
            }
        }
    }
    else {
        storePostText = {
            set:function(){},
            apply:function(){},
            clear:function(){}
        }
    }
    postInput.focus(function(){
        tweetBox.addClass("uncondensed");
    }).blur(condensed).keyup(function(e){
            storePostText.set();
            var val = postInput.val();
            if (val != "") {
                tweetButton.removeClass("disabled").removeAttr("disabled")
            }
            else {
                tweetButton.addClass("disabled").attr("disabled",true)
            }
            textTips(val);
        }).keydown(function(e){
            //Mac习惯用command
            (e.metaKey || e.ctrlKey) && e.keyCode === 13 && postInput.parent('form').trigger('submit');
        })
    storePostText.apply();
    postInput.parent('form').submit(function(e){
        e.preventDefault();
        storePostText.clear();
        $(this).get(0).submit();
    });
    !function(){
        if (postInput.val() != "") {
            tweetBox.addClass("uncondensed");
            var length = postInput.val().length;
            oPostInput.setSelectionRange(length ,length );
            oPostInput.focus();
            tweetButton.removeClass("disabled").removeAttr("disabled");
            textTips(postInput.val());
        }
    }();
});