/*! itwitter 2013-07-26 */
define("dist/js/views/common_tweet",["lib/backbone","_","jquery","lib/jquery","../util","lib/twitter-text","lib/underscore","lib/moment","moment","../templates/modal.handlebars"],function(a,b,c){a.async("lib/jquery-plugins/bootstrap-transition"),a.async("lib/jquery-plugins/bootstrap-modal.js"),a.async("lib/jquery-plugins/drag");var d=a("lib/backbone"),e=a("lib/jquery"),f=a("../util"),g=a("../templates/modal.handlebars"),h=a("lib/twitter-text"),i=e("body"),j=d.View.extend({initialize:function(){},textLengthTips:function(a,b,c,d){var e=f.messageLength(b),g=140-e;""==b?(c(),a.removeClass("text-warn")):140>=e?(d(),e>=130?a.addClass("text-warn"):a.removeClass("text-warn")):(a.addClass("text-warn"),c()),a.text(g)},getTextWrap:function(a){return a.innerText?a.innerText:e(a).html().replace(/<br>/g,"&#10;").replace(f.REG_NOHTML,"")},withRichEditor:function(){var a,b,c=window.getSelection().getRangeAt(0),d=c.endContainer,e=d.previousSibling&&d.previousSibling.innerHTML||d.data,f=this.htmlRich.getSelectionOffsets();if(h.extractUrls(e).length&&!this.$editor.attr("data-in-composition")&&(a=this.$editor.html().replace(/<a[^><]*>|<\/a>/g,""),b=h.extractUrlsWithIndices(a),this.$editor.html(h.autoLinkEntities(a,b,{urlTarget:"_blank",rel:"nofollow"})),this.htmlRich.setSelectionOffsets([parseInt(f)+1])),this.textLength.text()<0&&!this.$editor.attr("data-in-composition")){var g=140;h.extractUrls(this.$editor.text()).forEach(function(a){g-=20-a.length}),this.$editor.html(this.$editor.html().replace(/<\/*em>/g,""));var i=this.editor.innerText?this.editor.innerText.length-this.$editor.text().length:this.$editor.find("br").length;this.htmlRich.emphasizeText([g+(this.$editor.hasClass("textbox")?i?this.editor.innerText?i-2:i-1:0:i?i-1:0),Number.MAX_VALUE]),this.$editor.html(this.$editor.html().replace("</em>","")+"</em>"),this.htmlRich.setSelectionOffsets([parseInt(f)])}this.saveEditData()},tweetDialog:function(a,b,c,d,f){a.itemHTML=a.itemHTML.replace(/<div\sclass=\"tweet-actions\".+div>/,"");var h=e(g(a));h.modal().css({marginTop:-h.outerHeight()/2+"px"}).addClass("fade_in"),i.addClass("modal-enabled"),c(),h.on("shown",function(){b===!0&&h.css({marginTop:-h.outerHeight()/2+"px"}),i.addClass("modal-enabled"),c()}),h.on("hidden",function(){i.removeClass("modal-enabled"),d()});var j=h.find("[data-action]").on("click.delDialog",f);return h.keyup(function(a){13===a.keyCode&&j.trigger("click.delDialog")}),h}});c.exports=new j}),define("dist/js/util",["lib/twitter-text","lib/underscore","lib/moment","moment"],function(a,b,c){function d(a){function b(){h().diff(e)/d.day>1||(a.html(e.twitter()),h().diff(e)/6e4<1?(c=1e3*(60-parseInt(a.html())),c>g?(g*=i,i++):g=c):f.each(d,function(a){return h().diff(e)/a>1?(g=a,!1):void 0}),setTimeout(b,g))}var c,d={day:864e5,hour:36e5,minute:6e4,second:1e3},e=h(a.data("time")),g=5e3,i=1;b()}var e=a("lib/twitter-text"),f=a("lib/underscore"),g=function(a){return e.extractUrls(a).forEach(function(b){a=a.replace(b.toString(),"填充填充填充填充填充填充填充填二十个汉字")}),a.length},h=a("lib/moment");c.exports={REG_NOHTML:/<\S[^><]*>/g,messageLength:g,timer:d}}),define("dist/js/templates/modal.handlebars",["lib/runtime"],function(a,b,c){var d=a("lib/runtime"),e=d.template;c.exports=e(function(a,b,c,d,e){this.compilerInfo=[3,">= 1.0.0-rc.4"],c=c||{};for(var f in a.helpers)c[f]=c[f]||a.helpers[f];e=e||{};var g,h="",i="function",j=this.escapeExpression;return h+='<div id="',(g=c.id)?g=g.call(b,{hash:{},data:e}):(g=b.id,g=typeof g===i?g.apply(b):g),h+=j(g)+'" class="modal tweet-dialog hide" tabindex="-1" role="dialog" aria-hidden="true">\r\n    <div class="modal-header" data-toggle="draggable" data-target="#',(g=c.id)?g=g.call(b,{hash:{},data:e}):(g=b.id,g=typeof g===i?g.apply(b):g),h+=j(g)+'">\r\n        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>\r\n        <h3>',(g=c.title)?g=g.call(b,{hash:{},data:e}):(g=b.title,g=typeof g===i?g.apply(b):g),h+=j(g)+'</h3>\r\n    </div>\r\n    <div class="modal-body media">',(g=c.itemHTML)?g=g.call(b,{hash:{},data:e}):(g=b.itemHTML,g=typeof g===i?g.apply(b):g),(g||0===g)&&(h+=g),h+='</div>\r\n    <div class="modal-footer">\r\n        <button class="btn" data-dismiss="modal">取消</button>\r\n        <button class="btn btn-primary" data-action="active">',(g=c.action)?g=g.call(b,{hash:{},data:e}):(g=b.action,g=typeof g===i?g.apply(b):g),h+=j(g)+"</button>\r\n    </div>\r\n</div>"})});