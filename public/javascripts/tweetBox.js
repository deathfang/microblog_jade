document.addEventListener('DOMContentLoaded',function(){
    var tweetBox = $(".tweet-box");
    var postInput = tweetBox.find('[name=post]');
    var oPostInput = postInput.get(0);
    var toolbar = tweetBox.find(".toolbar");
    var tweetButton = toolbar.find("button");
    var msgtips = $(".tweet-counter");
    var condensed = function(){
        postInput.val() == "" && tweetBox.removeClass("uncondensed");
    }

    var tbutton = new tUtil.ButtonStatus(tweetButton,"btn-primary")
    var textTips = function(val){
        var msglen = tUtil.msglen(val),
            tips = 140-msglen;
        if (val == "") {
            tbutton.disable().remove();
            msgtips.removeClass("text-warn");
        }
        else if (msglen<=140) {

            tbutton.active().add();
            msgtips.removeClass("text-warn");
        } else {
            msgtips.addClass("text-warn");
            tbutton.disable().remove();
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

            tbutton.active().add();
            textTips(postInput.val());
        }
    }();
});