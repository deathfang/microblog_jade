$(".postlist").delegate(".icon-remove","click",function(e){
    e.preventDefault();
    var post = $(this).parents(".media");
    $.get("/del/" + post.attr("id"),function(res){
        res && post.fadeTo("normal",0,function(){
            $(this).animate({width:"toggle",height:"toggle"},"normal",function(){
                post.remove();
            })
        })
    });
})
$(".postlist").delegate(".icon-edit","click",function(e){
    e.preventDefault();
    var postEditor = $(this).parents(".media").find(".post p"),
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
            range = document.createRange(),
            startPoint,endPoint,text,url
            hasLine = postHTML.match(/<div>|<br>/g);//火狐换行是 <br>
        if (hasLine) {
            feedLine = postHTML.replace("<div>","&#10;").replace(/<div>/g,"").replace(/<\/div>|<br>/g,"&#10;");
            postEditor.html(feedLine)
        }
        if (postEditor.text().match(tUtil.urlRxp)) {
            [].map.call(postEditor.get(0).childNodes,function(i){
                if(i.nodeType == 3 || i.nodeType == 4){
                    text = $(i).text();
                    url  = text.match(tUtil.urlRxp);
                    if (url) {
                        startPoint = text.indexOf(url);
                        endPoint = url[0].length + startPoint;
                        range.setStart(i,startPoint);
                        range.setEnd(i,endPoint);
                        var anchor = $(wrapLinks(url)).get(0)
                        range.surroundContents(anchor);
                    }
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
    function wrapLinks(match){
        var tokens = {};
        tokens.url = tokens.text = match;
//        tokens.text = tokens.url.replace(/(http(s?):\/\/)?(www\.)?/, "");
//        tokens.text.length > 19 && (tokens.text = tokens.text.slice(0,19) + "...")
        return tUtil.sub(tUtil.linkTemp, tokens);
    }
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
                    savelabel = $('<span class="modal label-success hide fade">保存成功</span>').appendTo(postEditor.parent());
                }else {
                    savelabel = postEditor.find('.modal');
                }
                savelabel.modal({backdrop:false})
                savelabel.on('shown',function(){
                    saveButton.unbind('click');
                    postEditor.unbind('keydown');
                    setTimeout(function(){
                        savelabel.modal('hide');
                    },500)
                })
            }
        });
    }
})