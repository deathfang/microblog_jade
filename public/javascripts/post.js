!function($){
    var tweetCount = $(".stats li:first strong");
    var tweetBox = $(".tweet-box");
    var postEditor = tweetBox.find(".textbox");
    var o_postEditor = postEditor.get(0);
    var PLACEHOLDER = "<div>撰写新推文...</div>";
    var boxUpdated = localStorage.getItem("boxUpdated") || false;
    var toolbar = tweetBox.find(".toolbar");
    var tweetLength = toolbar.find('.tweet-counter')
    var tweetButton = toolbar.find("button");
    var postList = $(".postlist");
    var tweetBack = {};
    var htmlRich = htmlText(o_postEditor,UA);
    var condensed = function(){
        if (postEditor.text().trim() === "") {
            tweetBox.removeClass("uncondensed");
            postEditor.html(PLACEHOLDER);
            boxUpdated = false;
        }
    }
    function getText(element){
        //contenteditable下换行有div innerText有换行 jQuery text()和textContent无
        //Firefox不支持innerText 单独处理
        return element.innerText ?
                element.innerText :
                $(element).html().replace(/<br>/g,"&#10;").replace(/<\S[^><]*>/g,'')
    }
    var tbutton = new tUtil.ButtonStatus(tweetButton,"btn-primary")

    storePostText = {
        set:function(item){
            localStorage.setItem('postText',item);
        },
        apply:function (){
            localStorage.getItem('postText') &&
                localStorage.getItem('postText').replace(/<\S[^><]*>/g,'').replace(/&nbsp;/g,"").trim() &&                        postEditor.html(localStorage.getItem('postText'));
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
    postEditor.focus(function(e){
        tweetBox.addClass("uncondensed");
        if (!boxUpdated) {
            postEditor.html("");
            htmlRich.setSelectionOffsets([0])
        }
        focusEditor()
    }).blur(condensed).on("input",function(e){
            if (!postEditor.attr("data-in-composition")) {
                tUtil.textLengthTips(tweetLength,postEditor.text(),function(){
                    tbutton.disable().goOut();
                },function(){
                    postEditor.text().trim() && tbutton.active().highlight();
                });
                if (postEditor.text().trim()){
                    localStorage.setItem("boxUpdated",true);
                    boxUpdated = true;
                }
                else {
                    localStorage.removeItem("boxUpdated");
                }
                storePostText.set(postEditor.html());
            }
        }).keydown(function(e){
            //Mac习惯用command
            (e.metaKey || e.ctrlKey) && e.keyCode === 13 &&
                !tweetButton.attr("disabled") && postEditor.parent('form').trigger('submit');
        }).on("keyup.withRichEditor paste.withRichEditor",withRichEditor);
    storePostText.apply();
    postEditor.parent('form').submit(function(e){
        e.preventDefault();
        tweetBox.addClass("tweeting");
        $.post("/post",{post:getText(o_postEditor)
            },function(res){
                tweetBox.removeClass("tweeting");
                typeof res == "string" && (res = JSON.parse(res));
                var newPost = $(res.postHTML);
                postList.prepend(newPost);
                tweetCount.text(parseInt(tweetCount.text()) + res.inc);
                var newPostTime = newPost.find(".time");
                tUtil.timer(newPostTime);
                setTimeout(function(){
                    newPost.removeClass('animate-hide');
                },500)
                storePostText.backup(res.id,postEditor.html());
                postEditor.text("").blur();
                storePostText.clear("postText");
                localStorage.removeItem("boxUpdated");
                setTimeout(function(){
                    tUtil.messagesTips("你的推文已发布!",1000,"alert-tips")
                },1000)
            })
    });
    !function(){
        if (postEditor.text() !== "" && boxUpdated) {
            tweetBox.addClass("uncondensed");
            postEditor.focus(focusEditor).focus();
            tbutton.active().highlight();
            tUtil.textLengthTips(tweetLength,postEditor.text(),function(){
                tbutton.disable().goOut();
            },function(){
                tbutton.active().highlight();
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
                    tbutton.active().highlight();
                    dialog.remove();
                    dialog = null;
                    setTimeout(function(){
                        post.remove();
                        tUtil.messagesTips("你的推文已删除。",1000,"alert-tips");
                        tweetCount.text(parseInt(tweetCount.text()) - 1);
                    },1000)
                    if (localStorage.getItem("backup")){
                        setTimeout(function(){
                            boxUpdated = true;
                            var backPost = JSON.parse(localStorage.getItem("backup"))[id];
                            postEditor.html(backPost).focus();
                            storePostText.set(backPost);
                            localStorage.setItem("boxUpdated",true);
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

        postEditor.attr("contenteditable",true).focus();

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
            $.post('/edit/'+ postID,{post:getText(o_postEditor)},function(res){
                //Mac Chrome下 res 是string类型
                typeof res === 'string' && (res = JSON.parse(res));
                if (res.post) {
                    postEditor.html(res.post);
                    postTime.replaceWith(res.time);
                    var newPostTime = $('#' + postID + ' .time');
                    tUtil.timer(newPostTime);
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
                    storePostText.backup(postID,postEditor.html());
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
        !postEditor.attr("data-in-composition") && tUtil.textLengthTips(tweetCount,postEditor.text(),function(){
            saveButton.addClass('hide')
        },function(){
            saveButton.removeClass('hide')
        });
    });

    function focusEditor(e){
        var postEditor = $(this);
        var htmlRich = htmlText(this,UA);
        postEditor.find("a").each(function(){
            var anchor = $(this),emTxt = anchor.find("em")
            anchor.html(
                anchor.html().replace(anchor.text(),anchor.attr("href")).replace(emTxt,"<em"> + emTxt + "</em>")
            )
        });
//          初次load时需要
        htmlRich.setSelectionOffsets([
            this === o_postEditor ?
                getText(this).length :
                postEditor.text().length
        ])
    }

    postList.on("focus.focusEditor",".post p",focusEditor);

    function withRichEditor (e){
        var postEditor = $(this);
        var oPostEditor = this;
        var currentRange = window.getSelection().getRangeAt(0);
        var currentNode = currentRange.endContainer;
        var currentHTML = currentNode.previousSibling && currentNode.previousSibling.innerHTML || currentNode.data;
        var htmlRich = htmlText(oPostEditor,UA);
        var cursorPosition = htmlRich.getSelectionOffsets();
        var html,urls;
        if (twitterText.extractUrls(currentHTML).length && !postEditor.attr("data-in-composition")){

            //过滤<a..> </a> a的文本和其他url文本继续转换 焦点保持在url最后
            html = postEditor.html().replace(/<a[^><]*>|<\/a>/g,"");
            urls = twitterText.extractUrlsWithIndices(html);
            postEditor.html(
                twitterText.autoLinkEntities(
                    html,urls,tUtil.wraplinkAttrs
                )
            )
            htmlRich.setSelectionOffsets([parseInt(cursorPosition) + 1])
        }

        if (postEditor.parent().parent().find(".tweet-counter").text() < 0 && !postEditor.attr("data-in-composition")) {
            var emPosition = 140;
            twitterText.extractUrls(postEditor.text()).forEach(function(item){
                emPosition -= 20 - item.length;
            })
            //仅创建一个em 焦点需要定位到em后面
            postEditor.html(postEditor.html().replace(/<\/*em>/g,''));
            //计算几个换行符 Firefox查找br
            var lineCount = oPostEditor.innerText ? oPostEditor.innerText.length - postEditor.text().length :
                postEditor.find("br").length;
            htmlRich.emphasizeText([
                emPosition + (
                    //目标为tweetBox
                    oPostEditor === o_postEditor ?
                        //是否有换行情况细节计算 后面加减 -1 -2原因不明 火狐-1 webkit -2
                        (lineCount ? (oPostEditor.innerText ? lineCount - 2: lineCount - 1): 0 ) :
                        (lineCount ? lineCount - 1: 0 )
                    ),
                Number.MAX_VALUE
            ]);
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
        tUtil.timer(postTime)
    })
}(jQuery)