!function($){
    var tweetCount = $(".stats li:first strong");
    var tweetBox = $(".tweet-box");
    var postInput = tweetBox.find('[name=post]');
    var oPostInput = postInput.get(0);
    var toolbar = tweetBox.find(".toolbar");
    var tweetButton = toolbar.find("button");
    var msgtips = $(".tweet-counter");
    var postList = $(".postlist");
    var overstepPoint;
    var tweetBack = {};
    var condensed = function(){
        postInput.val() === "" && tweetBox.removeClass("uncondensed");
    }

    var tbutton = new tUtil.ButtonStatus(tweetButton,"btn-primary")
    var textTips = function(val){
        var msglen = tUtil.msglen(val),
            tips = 140-msglen;
        if (val == "") {
            tbutton.disable().remove();
            msgtips.removeClass("text-warn");
        }
        else if (msglen <= 140) {
            tbutton.active().add();
            msglen >= 130 ? msgtips.addClass("text-warn") : msgtips.removeClass("text-warn");
        } else {
            typeof overstepPoint === "undefined" && (overstepPoint = oPostInput.selectionStart);
            msgtips.addClass("text-warn");
            tbutton.disable().remove();
        }
        msgtips.text(tips);
    }
    storePostText = {
        set:function(item){
            localStorage.setItem('postText',item);
        },
        apply:function (){
            typeof localStorage.getItem('postText') !== 'undefined' && postInput.val(localStorage.getItem('postText'));
            localStorage.removeItem('backup')
        },
        clear:function(item){
            arguments.length > 0 ? localStorage.removeItem(item) : localStorage.clear();
        },
        backup:function(id,val){
            tweetBack[id] = val;
            localStorage.setItem('backup',JSON.stringify(tweetBack));
        }
    }
    postInput.focus(function(){
        tweetBox.addClass("uncondensed");
    }).blur(condensed).keyup(function(e){
            storePostText.set(postInput.val());
            var val = postInput.val();
            textTips(val);
        }).keydown(function(e){
            //Mac习惯用command
            (e.metaKey || e.ctrlKey) && e.keyCode === 13 && postInput.parent('form').trigger('submit');
        })
    storePostText.apply();
    postInput.parent('form').submit(function(e){
        e.preventDefault();
        if (!tweetButton.attr("disabled")) {
            tweetBox.addClass("tweeting");
            $.post("/post",{post:postInput.val()},function(res){
                tweetBox.removeClass("tweeting");
                typeof res == "string" && (res = JSON.parse(res));
                storePostText.backup(res.id,postInput.val());
                postInput.blur().val("");
                condensed();
                storePostText.clear("postText");
                postList.prepend($(res.postHTML));
                tweetCount.text(parseInt(tweetCount.text()) + res.inc);
                tUtil.messagesTips("你的推文已发布!",1000,"alert-tips")
            })
        }
        else {
            oPostInput.setSelectionRange(overstepPoint,postInput.val().length)
            //有问题 用处不大
        }
    });
    !function(){
        if (postInput.val() !== "") {
            tweetBox.addClass("uncondensed");
            var length = postInput.val().length;
            oPostInput.setSelectionRange(length ,length );
            oPostInput.focus();
            tbutton.active().add();
            textTips(postInput.val());
        }
    }();
    var deleteDialog;
    postList.delegate(".icon-remove","click",function(e){
        e.preventDefault();
        var post = $(this).parents(".media");
        deleteDialog = tUtil.tweetDialog("delete-tweet-dialog","确定要删除这条推文吗?",post.html(),"删除");
        deleteDialog.find(".btn-primary").click(function(){
            $.get("/del/" + post.attr("id"),function(dec){
                if(dec) {
                    deleteDialog.modal('hide');
                        post.animate({height:"toggle"},30,function(){
                            post.remove();
                            if (localStorage.getItem("backup")){
                                var backPost = JSON.parse(localStorage.getItem("backup"))[post.attr("id")];
                                postInput.val(backPost).get(0).select();
                                storePostText.set(backPost);
                            }
                            tbutton.active().add();
                            tweetCount.text(parseInt(tweetCount.text()) + parseInt(dec));
                            tUtil.messagesTips("你的推文已删除。",1000,"alert-tips");
                            deleteDialog.remove();
                            deleteDialog = null;
                        })
                }
            });
        })

    })
    postList.delegate(".icon-edit","click",function(e){
        e.preventDefault();
        var postEditor = $(this).parents(".media").find(".post p"),
            o_posEditor = postEditor.get(0),
            saveButton = $(this).next(),
            postText = postEditor.text();
        postEditor.attr("contenteditable",true).focus(function(){
            postEditor.find("a").each(function(){
                $(this).text($(this).attr("href"))
            })
        }).focus();
        postEditor.on("keyup paste",function(){
            if (saveButton.is(":hidden")) {
                saveButton.removeClass("hide");
            }
        }).blur(function(){
                var postHTML = postEditor.html(),
                    feedLine,
                    startPoint,endPoint,text,url,
                    newIndex = 0,newChild,
                    hasLine = postHTML.match(/<div>|<br>/g);//火狐换行是 <br>
                if (hasLine) {
                    feedLine = postHTML.replace("<div>","&#10;").replace(/<div>/g,"").replace(/<\/div>|<br>/g,"&#10;");
                    postEditor.html(feedLine)
                }
                if (postEditor.text().match(tUtil.urlRxp)) {
                    [].map.call(o_posEditor.childNodes,function(child,index){
                        if(child.nodeType == 3 || child.nodeType == 4){
                            text = $(child).text();
                            url  = text.match(tUtil.urlRxp);
                            url && url.forEach(function(item,index2){
                                newChild = o_posEditor.childNodes[index + index2 + newIndex];
                                text = $(newChild).text();
                                startPoint = text.indexOf(item);
                                endPoint = item.length + startPoint;
                                var range = document.createRange();
                                range.setStart(newChild,startPoint);
                                range.setEnd(newChild,endPoint);
                                var anchor = $(tUtil.wrapLinks(item)).get(0)
                                range.surroundContents(anchor);
                                newIndex++;
                            })
                        }
                    });
                }
            });
        saveButton.click(function(e){
            e.preventDefault();
            if (postTextChange()) {
                postEditor.attr("contenteditable",false);
                savePost();
            }
            else {
                textTips()
            }

        });
        postEditor.keydown(function(e){
            if ((e.metaKey || e.ctrlKey) && e.keyCode === 13){
                if (postTextChange()) {
                    postEditor.blur().attr("contenteditable",false);
                    savePost();
                }else {
                    textTips()
                }
            }
        });

        function postTextChange(){
            return postText !== postEditor.text() && postEditor.text() !== "undefined";
        }

        function textTips(){
            postEditor.parent().tooltip({
                title:"修改了才能提交( ´◔ ‸◔`)！",
                trigger:"manual"
            }).tooltip('show');
            setTimeout(function(){
                postEditor.parent().tooltip('hide');
            },2000)
        }

        function savePost(){
            $.post('/edit/'+postEditor.parents('.media').attr('id'),{post:postEditor.text()},function(postHTML){
                if (postHTML) {
                    postEditor.html(postHTML);
                    saveButton.toggleClass("hide");
                    var savelabel;
                    if (postEditor.find('.modal').length < 1) {
                        savelabel = $('<span class="modal hide fade">保存成功</span>').appendTo(postEditor.parent());
                    }else {
                        savelabel = postEditor.find('.modal');
                    }
                    savelabel.modal({backdrop:false})
                    savelabel.on('shown',function(){
                        saveButton.unbind('click');
                        postEditor.unbind('keydown');
                        setTimeout(function(){
                            savelabel.modal('hide');
                        },1000)
                    })
                }
            });
        }
    })
}(jQuery)