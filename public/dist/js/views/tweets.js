/*! itwitter 2013-07-26 */
define("dist/js/views/tweets",["lib/backbone","_","jquery","lib/jquery","lib/html-text","../util","lib/twitter-text","lib/underscore","lib/moment","moment","./common_tweet","../templates/modal.handlebars","./messages_tips","../templates/message_alert.handlebars"],function(a,b,c){a.async("lib/jquery-plugins/bootstrap-tooltip.js");var d=a("lib/backbone"),e=a("lib/jquery"),f=a.async("UA"),g=a("lib/html-text"),h=a("../util"),i=a("./common_tweet"),j=a("./messages_tips"),k=e(".dashboard .stats li:first strong"),l=d.View.extend({events:{"click .icon-remove":"delClick","click .icon-edit":"edit","click .icon-save":"preSave","focus .post p":"focus","keydown .post p":"updateOnEnter","keyup.withRichEditor .post p":"withRichEditor","paste.withRichEditor .post p":"withRichEditor"},initialize:function(a){this.el=a.el,this.$editor=this.$(".post p"),this.editor=this.$editor[0],this.textLength=this.$(".tweet-counter"),this.saveButton=this.$(".icon-save"),this.oldText=this.model.get("text"),this.editorContainer=this.$editor.parent(),this.htmlRich=g(this.editor,f),this.listenTo(this.model,"change:text",this.render),this.$editor.on("input",function(){this.textLength.is(":hidden")&&this.textLength.removeClass("hide")}.bind(this))},render:function(){!this.$editor.attr("data-in-composition")&&i.textLengthTips(this.textLength,this.model.get("text"),this.disable.bind(this),this.enable.bind(this))},disable:function(){this.saveButton.addClass("hide")},enable:function(){this.saveButton.removeClass("hide")},"delete":function(a,b){e.post("/del/"+a,function(a){a&&(b.modal("hide"),e.when(this.$el.addClass("animate-hide fast_hide")).done(function(){setTimeout(function(){var a=e.Deferred();return this.remove(),new j({text:"你的推文已删除",duration:1e3}),k.text(parseInt(k.text())-1),a.resolve()}.bind(this),300)}).done(function(){this.model.get("backup")&&this.trigger("restore")}.bind(this)),this.model.destroy(),this.deleteDialog.remove())}.bind(this))},delDialogAttrs:function(){return{id:"delete-tweet-dialog-"+this.el.id,title:"确定要删除这条推文吗?",itemHTML:this.el.innerHTML,action:"删除"}},tweetBoxState:function(a){var b=document.querySelector(".tweet-box .textbox");return a.get("backup")?{enable:function(){b.contentEditable=!0,b.focus()},disable:function(){b.contentEditable=!1}}:{enable:function(){},disable:function(){}}},delClick:function(a){a.preventDefault();var b=this.tweetBoxState(this.model);this.deleteDialog?this.oldText!==this.model.get("text")?(this.deleteDialog.remove(),this.deleteDialog=i.tweetDialog(this.delDialogAttrs(),!0,b.disable,b.enable,function(){this.delete(this.el.id,this.deleteDialog)}.bind(this)),this.oldText=this.model.get("text")):this.deleteDialog.modal():(this.deleteDialog=i.tweetDialog(this.delDialogAttrs(),!1,b.disable,b.enable,function(){this.delete(this.el.id,this.deleteDialog)}.bind(this)),this.oldText=this.model.get("text"))},edit:function(a){a.preventDefault(),this.$editor.attr("contenteditable",!0).focus()},focus:function(){var a=this.$editor.find("a");a.filter(function(){return this.title.length>20}).length&&a.each(function(a,b){var c=e(b);c.html(c.html().replace(c.text(),c.attr("href"))),this.model.set({text:this.$editor.text(),html:this.$editor.html()})}.bind(this)),this.htmlRich.setSelectionOffsets([this.model.get("text").length])},preSave:function(a){a.preventDefault(),this.model.get("updated")?this.save():this.textWarn()},save:function(){e.post("/edit/"+this.el.id,{post:i.getTextWrap(this.editor)},function(a){if(a.content){this.$editor.html(a.content),this.editorContainer.prev().replaceWith(a.time);var b=e("#"+this.el.id+" .time");h.timer(b),this.$editor.attr({contenteditable:!1}).blur(),this.saveButton.addClass("hide"),this.textLength.addClass("hide"),!this.saveLabel&&(this.saveLabel=e('<span class="modal hide fade">保存成功</span>').appendTo(this.editorContainer)),this.saveLabel.modal({backdrop:!1}),this.saveLabel.on("shown",function(){setTimeout(function(){e(this).modal("hide")}.bind(this),1e3)}),this.oldText=this.model.get("text"),this.model.set({updated:!1})}}.bind(this))},updateOnEnter:function(a){(a.metaKey||a.ctrlKey)&&13===a.keyCode&&(this.model.get("updated")&&this.saveButton.is(":visible")?this.save():this.textWarn())},textWarn:function(){this.editorContainer.tooltip({title:"修改下嘛( ´◔ ‸◔`)！",trigger:"manual"}).tooltip("show"),setTimeout(function(){this.editorContainer.tooltip("hide")}.bind(this),1500)},saveEditData:function(){this.model.set({text:this.$editor.text(),html:this.$editor.html()}),this.model.set({updated:this.oldText!==this.model.get("text")&&this.model.get("text").trim()})},withRichEditor:function(){i.withRichEditor.bind(this)()}});c.exports=l}),define("dist/js/util",["lib/twitter-text","lib/underscore","lib/moment","moment"],function(a,b,c){function d(a){function b(){h().diff(e)/d.day>1||(a.html(e.twitter()),h().diff(e)/6e4<1?(c=1e3*(60-parseInt(a.html())),c>g?(g*=i,i++):g=c):f.each(d,function(a){return h().diff(e)/a>1?(g=a,!1):void 0}),setTimeout(b,g))}var c,d={day:864e5,hour:36e5,minute:6e4,second:1e3},e=h(a.data("time")),g=5e3,i=1;b()}var e=a("lib/twitter-text"),f=a("lib/underscore"),g=function(a){return e.extractUrls(a).forEach(function(b){a=a.replace(b.toString(),"填充填充填充填充填充填充填充填二十个汉字")}),a.length},h=a("lib/moment");c.exports={REG_NOHTML:/<\S[^><]*>/g,messageLength:g,timer:d}}),define("dist/js/views/common_tweet",["lib/backbone","_","jquery","lib/jquery","dist/js/util","lib/twitter-text","lib/underscore","lib/moment","moment"],function(a,b,c){a.async("lib/jquery-plugins/bootstrap-transition"),a.async("lib/jquery-plugins/bootstrap-modal.js"),a.async("lib/jquery-plugins/drag");var d=a("lib/backbone"),e=a("lib/jquery"),f=a("dist/js/util"),g=a("dist/js/templates/modal.handlebars"),h=a("lib/twitter-text"),i=e("body"),j=d.View.extend({initialize:function(){},textLengthTips:function(a,b,c,d){var e=f.messageLength(b),g=140-e;""==b?(c(),a.removeClass("text-warn")):140>=e?(d(),e>=130?a.addClass("text-warn"):a.removeClass("text-warn")):(a.addClass("text-warn"),c()),a.text(g)},getTextWrap:function(a){return a.innerText?a.innerText:e(a).html().replace(/<br>/g,"&#10;").replace(f.REG_NOHTML,"")},withRichEditor:function(){var a,b,c=window.getSelection().getRangeAt(0),d=c.endContainer,e=d.previousSibling&&d.previousSibling.innerHTML||d.data,f=this.htmlRich.getSelectionOffsets();if(h.extractUrls(e).length&&!this.$editor.attr("data-in-composition")&&(a=this.$editor.html().replace(/<a[^><]*>|<\/a>/g,""),b=h.extractUrlsWithIndices(a),this.$editor.html(h.autoLinkEntities(a,b,{urlTarget:"_blank",rel:"nofollow"})),this.htmlRich.setSelectionOffsets([parseInt(f)+1])),this.textLength.text()<0&&!this.$editor.attr("data-in-composition")){var g=140;h.extractUrls(this.$editor.text()).forEach(function(a){g-=20-a.length}),this.$editor.html(this.$editor.html().replace(/<\/*em>/g,""));var i=this.editor.innerText?this.editor.innerText.length-this.$editor.text().length:this.$editor.find("br").length;this.htmlRich.emphasizeText([g+(this.$editor.hasClass("textbox")?i?this.editor.innerText?i-2:i-1:0:i?i-1:0),Number.MAX_VALUE]),this.$editor.html(this.$editor.html().replace("</em>","")+"</em>"),this.htmlRich.setSelectionOffsets([parseInt(f)])}this.saveEditData()},tweetDialog:function(a,b,c,d,f){a.itemHTML=a.itemHTML.replace(/<div\sclass=\"tweet-actions\".+div>/,"");var h=e(g(a));h.modal().css({marginTop:-h.outerHeight()/2+"px"}).addClass("fade_in"),i.addClass("modal-enabled"),c(),h.on("shown",function(){b===!0&&h.css({marginTop:-h.outerHeight()/2+"px"}),i.addClass("modal-enabled"),c()}),h.on("hidden",function(){i.removeClass("modal-enabled"),d()});var j=h.find("[data-action]").on("click.delDialog",f);return h.keyup(function(a){13===a.keyCode&&j.trigger("click.delDialog")}),h}});c.exports=new j}),define("dist/js/templates/modal.handlebars",["lib/runtime"],function(a,b,c){var d=a("lib/runtime"),e=d.template;c.exports=e(function(a,b,c,d,e){this.compilerInfo=[3,">= 1.0.0-rc.4"],c=c||{};for(var f in a.helpers)c[f]=c[f]||a.helpers[f];e=e||{};var g,h="",i="function",j=this.escapeExpression;return h+='<div id="',(g=c.id)?g=g.call(b,{hash:{},data:e}):(g=b.id,g=typeof g===i?g.apply(b):g),h+=j(g)+'" class="modal tweet-dialog hide" tabindex="-1" role="dialog" aria-hidden="true">\r\n    <div class="modal-header" data-toggle="draggable" data-target="#',(g=c.id)?g=g.call(b,{hash:{},data:e}):(g=b.id,g=typeof g===i?g.apply(b):g),h+=j(g)+'">\r\n        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>\r\n        <h3>',(g=c.title)?g=g.call(b,{hash:{},data:e}):(g=b.title,g=typeof g===i?g.apply(b):g),h+=j(g)+'</h3>\r\n    </div>\r\n    <div class="modal-body media">',(g=c.itemHTML)?g=g.call(b,{hash:{},data:e}):(g=b.itemHTML,g=typeof g===i?g.apply(b):g),(g||0===g)&&(h+=g),h+='</div>\r\n    <div class="modal-footer">\r\n        <button class="btn" data-dismiss="modal">取消</button>\r\n        <button class="btn btn-primary" data-action="active">',(g=c.action)?g=g.call(b,{hash:{},data:e}):(g=b.action,g=typeof g===i?g.apply(b):g),h+=j(g)+"</button>\r\n    </div>\r\n</div>"})}),define("dist/js/views/messages_tips",["lib/backbone","_","jquery","lib/jquery"],function(a,b,c){a.async("lib/jquery-plugins/bootstrap-transition"),a.async("lib/jquery-plugins/bootstrap-alert");var d=a("lib/backbone"),e=a("lib/jquery"),f=a("dist/js/templates/message_alert.handlebars"),g=d.View.extend({template:f,className:"alert alert-messages fade in",initialize:function(a){this.text=a.text,this.duration=a.duration,this.newClassName=a.newClassName||"alert-tips",this.render()},render:function(){this.$el.html(this.template({text:this.text})).appendTo(e("body")),this.$el.addClass(this.newClassName),setTimeout(function(){this.$el.alert("close")}.bind(this),this.duration)}});c.exports=g}),define("dist/js/templates/message_alert.handlebars",["lib/runtime"],function(a,b,c){var d=a("lib/runtime"),e=d.template;c.exports=e(function(a,b,c,d,e){this.compilerInfo=[3,">= 1.0.0-rc.4"],c=c||{};for(var f in a.helpers)c[f]=c[f]||a.helpers[f];e=e||{};var g,h="",i="function",j=this.escapeExpression;return h+='<button type="button" data-dismiss="alert" class="close">&times;</button>\r\n',(g=c.text)?g=g.call(b,{hash:{},data:e}):(g=b.text,g=typeof g===i?g.apply(b):g),h+=j(g)})});