!function($){
    var TimesMS = {
        day: 864e5,
        hour: 36e5,
        minute: 6e4,
        second: 1e3
    }
    var tweetCount = $(".stats li:first strong");
    var tweetBox = $(".tweet-box");
    var postInput = tweetBox.find('[name=post]');
    var oPostInput = postInput.get(0);
    var toolbar = tweetBox.find(".toolbar");
    var tweetLength = toolbar.find('.tweet-counter')
    var tweetButton = toolbar.find("button");
    var postList = $(".postlist");
//    var overstepPoint;
    var tweetBack = {};
    var condensed = function(){
        postInput.val() === "" && tweetBox.removeClass("uncondensed");
    }

    var tbutton = new tUtil.ButtonStatus(tweetButton,"btn-primary")
    var textLengthTips = function(msgtips,val,disable,enable,emphasizeText){
        var msglen = tUtil.msglen(val),
            tips = 140-msglen;
        if (val == "") {
            disable();
            msgtips.removeClass("text-warn");
        }
        else if (msglen <= 140) {
            enable();
            msglen >= 130 ? msgtips.addClass("text-warn") : msgtips.removeClass("text-warn");
        } else {
            msgtips.addClass("text-warn");
            disable();
            emphasizeText && emphasizeText();
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
    }).blur(condensed).on("input",function(e){
            storePostText.set(postInput.val());
            var val = postInput.val();
            textLengthTips(tweetLength,val,function(){
                tbutton.disable().remove();
            },function(){
                tbutton.active().add();
            });
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
                var newPost = $(res.postHTML);
                postList.prepend(newPost);
                tweetCount.text(parseInt(tweetCount.text()) + res.inc);
                var time = moment(res.now);
                if (moment.isMoment(time)) {
                    var interval = 5000,inc = 1,diff,
                        newPostTime = newPost.find(".time");
                    function renderTime(){
                        if (moment().diff(time)/(TimesMS.day) > 1) return;
                        newPostTime.html(time.twitter());
                        if (moment().diff(time)/6e4 < 1) {
                            diff = (60 - parseInt(newPostTime.html()))*1000;
                            if (diff > interval) {
                                interval = interval *inc;
                                inc++;
                            }else {
                                interval = diff;
                            }
                        }
                        else{
                            $.each(TimesMS,function(k,v){
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
                setTimeout(function(){
                    newPost.removeClass('animate-hide');
                },500)
                storePostText.backup(res.id,postInput.val());
                postInput.blur().val("");
                condensed();
                storePostText.clear("postText");
                setTimeout(function(){
                    tUtil.messagesTips("你的推文已发布!",1000,"alert-tips")
                },1000)
            })
        }
//        else {
//            oPostInput.setSelectionRange(overstepPoint,postInput.val().length)
//        }
    });
    !function(){
        if (postInput.val() !== "") {
            tweetBox.addClass("uncondensed");
            var length = postInput.val().length;
            oPostInput.setSelectionRange(length ,length );
            oPostInput.focus();
            tbutton.active().add();
            textLengthTips(tweetLength,postInput.val(),function(){
                tbutton.disable().remove();
            },function(){
                tbutton.active().add();
            });
        }
    }();
    var deleteDialog = {},
        updatePOST,
        actionCallback = function(post,id,dialog){
            $.post("/del/" + id,{count:parseInt(tweetCount.text()) - 1},function(res){
                if(res) {
                    dialog.modal("hide");
                    setTimeout(function(){
                        post.addClass('animate-hide fast_hide');
                        //弹层 遮罩消失后的视觉误差 放个延迟
                    },500)
                    tbutton.active().add();
                    dialog.remove();
                    dialog = null;
                    setTimeout(function(){
                        post.remove();
                        tUtil.messagesTips("你的推文已删除。",1000,"alert-tips");
                        tweetCount.text(parseInt(tweetCount.text()) - 1);
                    },1000)
                    if (localStorage.getItem("backup")){
                        setTimeout(function(){
                            var backPost = JSON.parse(localStorage.getItem("backup"))[id];
                            postInput.val(backPost).get(0).select();
                            storePostText.set(backPost);
                        //alert tips消失后再恢复
                        },2000)
                    }
                }
            });
        }
    postList.delegate(".icon-remove","click",function(e){
        e.preventDefault();
        var post = $(this).parents(".media"),
            postID = post.attr("id");
        if (!deleteDialog[postID]) {
            deleteDialog[postID] = tUtil.tweetDialog("delete-tweet-dialog-" + postID,"确定要删除这条推文吗?",post.html(),"删除",function(){
                actionCallback(post,postID,deleteDialog[postID])
            });
        }else if(updatePOST){
            deleteDialog[postID] = tUtil.tweetDialog("delete-tweet-dialog-" + postID,"确定要删除这条推文吗?",post.html(),"删除",true,function(){
                actionCallback(post,postID,deleteDialog[postID])
            });
        }else{
            deleteDialog[postID].modal();
        }
    });
    postList.delegate(".icon-edit","click",function(e){
        e.preventDefault();
        var postEditor = $(this).parents(".media").find(".post p"),
            o_postEditor = postEditor.get(0),
            saveButton = $(this).next(),
            tweetLength = saveButton.next(),
            postText = postEditor.text().trim(),
            postID = postEditor.parents('.media').attr('id'),
            postTime = $("#" + postID + ' .time');
        var htmlRich = htmlText(o_postEditor,UA);

        postEditor.attr("contenteditable",true).focus(function(){
            postEditor.find("a").each(function(){
                var anchor = $(this),emTxt = anchor.find("em")
                anchor.html(
                    anchor.html().replace(anchor.text(),anchor.attr("href")).replace(emTxt,"<em"> + emTxt + "</em>")
                )
            });
//            tUtil.setFocusLast(o_postEditor.lastChild);
            htmlRich.setSelectionOffsets([postEditor.text().length]);
        }).focus();

        saveButton.click(function(e){
            e.preventDefault();
           postTextChange() ? savePost() : textWarn();
        });
        postEditor.keydown(function(e){
            if ((e.metaKey || e.ctrlKey) && e.keyCode === 13){
                postTextChange() && saveButton.is(':visible') ? savePost() : textWarn()
            }
        });

        function postTextChange(){
            return updatePOST = (postText !== postEditor.text() && postEditor.text().trim());
        }

        function textWarn(){
            postEditor.parent().tooltip({
                title:"不能为空白( ´◔ ‸◔`)！",
                trigger:"manual"
            }).tooltip('show');
            setTimeout(function(){
                postEditor.parent().tooltip('hide');
            },1500)
        }

        function savePost(){
            postEditor.find("a").each(function(){
                $(this).text($(this).attr("href"))
            });
            //contenteditable下换行有div innerText有换行 jQuery text()和textContent无
            $.post('/edit/'+ postID,{
                //Firefox不支持innerText 单独处理
                post:o_postEditor.innerText ?
                    o_postEditor.innerText :
                    postEditor.html().replace(/<br>/g,"&#10;").replace(/<\S[^><]*>/g,'')
            },function(res){
                //Mac Chrome下 res 是string类型
                typeof res === 'string' && (res = JSON.parse(res));
                if (res.newPost.post) {
                    postEditor.html(res.newPost.post);
                    postTime.replaceWith(res.newPost.time);
                    var time = moment(res.now);
                    if (moment.isMoment(time)) {
                        var interval = 5000,inc = 1,diff,
                            newPostTime = $('#' + postID + ' .time');
                        function renderTime(){
                            if (moment().diff(time)/(TimesMS.day) > 1) return;
                            newPostTime.html(time.twitter());
                            if (moment().diff(time)/6e4 < 1) {
                                diff = (60 - parseInt(postTime.html()))*1000;
                                if (diff > interval) {
                                    interval = interval *inc;
                                    inc++;
                                }else {
                                    interval = diff;
                                }
                            }
                            else{
                                $.each(TimesMS,function(k,v){
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
                    o_postEditor.contentEditable = false;
                    o_postEditor.blur();
                    saveButton.addClass("hide");
                    tweetLength.addClass("hide");
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
                    });
                    storePostText.backup(postID,postEditor.text());
                }
            });
        }
    });
    postList.on("input",".post p",function(e){
        var postEditor = $(this);
        var tweetCount = postEditor.parent('.post').siblings(".tweet-actions").find(".tweet-counter");
        var saveButton = tweetCount.prev();
        tweetCount.is(":hidden") && tweetCount.removeClass("hide");
        saveButton.is(":hidden") && saveButton.removeClass("hide");
        !postEditor.attr("data-in-composition") && textLengthTips(tweetCount,postEditor.text(),function(){
            saveButton.addClass('hide')
        },function(){
            saveButton.removeClass('hide')
        });
    });

    function withRichEditor (e){
        var postEditor = $(this);
        var currentRange = window.getSelection().getRangeAt(0);
        var currentNode = currentRange.endContainer;
        var currentHTML = currentNode.previousSibling && currentNode.previousSibling.innerHTML || currentNode.data;
        var htmlRich = htmlText(this,UA);
        var cursorPosition = htmlRich.getSelectionOffsets();
        var html;
        if (twitterText.extractUrls(currentHTML).length > 0 && !postEditor.attr("data-in-composition")){

            //过滤<a..> </a> a的文本和其他url文本继续转换 焦点保持在url最后
            html = postEditor.html().replace(/<a[^><]*>|<\/a>/g,"");
            postEditor.html(
                twitterText.autoLinkEntities(
                    html,twitterText.extractUrlsWithIndices(html), tUtil.wraplinkAttrs
                )
            )
            htmlRich.setSelectionOffsets([parseInt(cursorPosition) + 1])
        }

        if (postEditor.parent().parent().find(".tweet-counter").text() < 0 && !postEditor.attr("data-in-composition")) {
            var normalizerText = postEditor.text();
            twitterText.extractUrls(normalizerText).forEach(function(item){
                normalizerText = normalizerText.replace(item,'axaxaxaxaxaxaxaxaxax')
            })
//            normalizerText.indexOf(140)
            //仅创建一个em 焦点需要定位到em后面
            postEditor.html(postEditor.html().replace(/<\/*em>/g,''));
            //139 要精确计算出来
            htmlRich.emphasizeText([139,Number.MAX_VALUE]);
            postEditor.html(
                postEditor.html().replace('</em>','') + '</em>'
            )
            htmlRich.setSelectionOffsets([parseInt(cursorPosition)])
        }
    }
//  这里paste 多超出140字em范围无效
    postList.on("keyup.withRichEditor paste.withRichEditor",".post p",withRichEditor);
    $(document).on("compositionstart", function(e){
        e.target.setAttribute("data-in-composition", "true")
    });
    $(document).on("compositionend", function(e){
        e.target.removeAttribute("data-in-composition")
    });
    postList.find(".time").each(function(){
        var postTime = $(this);
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
                $.each(TimesMS,function(k,v){
                   if (moment().diff(time)/v > 1){
                       interval = v;
                       return false;
                   }
                })
            }
            setTimeout(renderTime,interval);
        }
        renderTime();
    })
}(jQuery)