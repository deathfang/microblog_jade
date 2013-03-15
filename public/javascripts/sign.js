var regexpPw =  function($el, val, callback){
    callback({
        value: val,
        valid: /^[a-zA-Z0-9_]{6,}$/.test(val) && /[a-z]/i.test(val) && /\d/.test(val),
        message: "密码不能小于6位且必须包含一个数字或字母"
    });
}
$.backstretch([
    "img/bg1.png",
    "img/bg2.png"
], {duration: 3000, fade: 750});
$(".logo").tooltip();
$("input,select,textarea").not("[type=submit],[name=passwordsignup_confirm],#usernamesignup").jqBootstrapValidation({
    validationMessage:{
        email:"这不是Email"    //仅修改email，方便jade
    }
});
$("[name=passwordsignup_confirm]").jqBootstrapValidation({validationHandlers:["blur"]});

$("#register").submit(function(){
    $("[name=passwordsignup_confirm]").val() == "" &&  $("[name=passwordsignup_confirm]").parent(".control-group").addClass("error").find(".help-block").html('<ul role="alert"><li>请重复填写密码</li></ul>')
});
$("[href=#toregister]").click(function(){
    $("#usernamesignup").focus();
    $("#register input").attr("tabindex",1)
});
$("[href=#tologin]").click(function(){
    $("#username").focus();
    $("#register input").removeAttr("tabindex")
});
$(function(){
    if (location.hash == "#toregister") {
        $("#usernamesignup").focus();
        $("#register input").attr("tabindex",1);
    }
    else {
        $("#username").focus();
    }
});
$("#usernamesignup").on('keyup paste',function(){
    var $that = $(this);
    $.ajax({
        type:'POST',
        url:'/check_username',
        data:{username:$that.val()},
        beforeSend:function(){
            $that.addClass('check_loading');
        },
        success:function(data){
            if (!data) {
                $that.parent('.control-group')
                    .addClass('warning').removeClass('success')
                    .find('.help-block')
                    .html('<ul role="alert"><li>用户名已存在</li></ul>')
            }
            else {
                $that.parent('.control-group')
                    .removeClass('warning')
                    .find('.help-block').html('')
            }
        },
        complete:function(){
            $that.removeClass('check_loading');
        }
    })
}).change(function(){
        if (!$(this).parent('.control-group').hasClass('warning')) {
            $(this).addClass('success')
        }
    })