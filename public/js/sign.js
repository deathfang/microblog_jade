var regexpPw =  function($el, val, callback){
    callback({
        value: val,
        valid: /^[a-zA-Z0-9_]{6,}$/.test(val) && /[a-z]/i.test(val) && /\d/.test(val),
        message: "密码不能小于6位且必须包含一个数字和字母"
    });
}
define(function(require) {
    var $ = require('jquery');
    require("libs/jquery-plugins/bootstrap-tooltip");

require('libs/jquery-plugins/jqBootstrapValidation')

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
$("#login form").submit(function(e){
    e.preventDefault();
    $.post("/login",{
        username:$("#username").val(),
        password:$("#password").val(),
        loginkeeping:$("#loginkeeping").prop("checked") ? $("#loginkeeping").val() : null
    },function(res){
        if (res == 'err_id') {
            $("#username").parent('.control-group')
                .addClass('error')
                .find('.help-block')
                .html('<ul role="alert"><li>用户名不存在</li></ul>')
        }
        else if (res == 'err_pw'){
            $("#password").parent('.control-group')
                .addClass('error')
                .find('.help-block')
                .html('<ul role="alert"><li>密码错误</li></ul>')
        }
        else if (res) {
            location.reload();
        }
    })
});

function checkUnique(ele,warning,name,email){
    var $that = $(ele);
    var data = name ? {name:$that.val()} : {email:$that.val()};
    $.ajax({
        type:'POST',
        url:'/check_unique',
        data:data,
        beforeSend:function(){
            $that.addClass('check_loading');
        },
        success:function(data){
            if (!data) {
                $that.parent('.control-group')
                    .addClass('warning').removeClass('success')
                    .find('.help-block')
                    .html('<ul role="alert"><li>' + warning + '已存在</li></ul>')
            }
            else if(!email){
                $that.parent('.control-group')
                    .removeClass('warning')
                    .find('.help-block').html('')
            }
        },
        complete:function(){
            $that.removeClass('check_loading');
        }
    })
}

$("#emailsignup").blur(function(){
    checkUnique(this,'邮箱',false,true)
})

$("#usernamesignup").on('keyup paste',function(){
    checkUnique(this,'用户名',true)
}).blur(function(){
        if (!$(this).parent('.control-group').hasClass('warning')) {
            $(this).parent('.control-group').addClass('success')
        }
        if (!$(this).val().trim()) {
            $(this).parent('.control-group')
                .addClass('warning').removeClass('success')
                .find('.help-block')
                .html('<ul role="alert"><li>用户名不能为空白</li></ul>')
        }
    })
})