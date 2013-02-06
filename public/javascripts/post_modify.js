$(".postlist").delegate(".icon-remove","click",function(e){
    e.preventDefault()
    var post = $(this).parents(".span4");
    post.fadeTo("normal",0,function(){
        $(this).animate({width:"toggle",height:"toggle"},"normal",function(){
            post.remove();
            $.get("/del/" + post.attr("id"));
        })
    })
})
$(".postlist").delegate(".icon-edit","click",function(e){
    e.preventDefault();
    var postEditor = $(this).parents(".span4").find(".post p"),
        saveButton = $(this).next(),
        postText = postEditor.text();
    postEditor.attr("contenteditable",true).focus();
    postEditor.on("keyup paste",function(){
        if (saveButton.is(":hidden")) {
            saveButton.toggleClass("hide");
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
        if (e.ctrlKey && e.keyCode == 13){
            if (postTextChange()) {
                postEditor.blur().attr("contenteditable",false);
                savePost();
            }else {
                textTips()
            }
        }
    });
    function postTextChange(){
        return postText !== postEditor.text() && postEditor.text() != "undefined";
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
        $.post('/edit/'+postEditor.parents('.span4').attr('id'),{post:postEditor.text()});
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
            },1000)
        })
    }
})