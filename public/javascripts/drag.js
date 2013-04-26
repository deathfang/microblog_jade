!function ($) {
    function Draggable(opt){
        this.options = $.extend({
            dom: null,
            handle: null,   //触发事件的dom
        }, opt || {});
        
        this.init();   
    }

    Draggable.prototype = {
        init: function(){
            this.dom = $(this.options.dom);
            this.handle = this.options.handle ? this.dom.find(this.options.handle) : this.dom;
            this.handle ? this.handle.addClass('ui-draggable') : this.dom.addClass('ui-draggable');
            
            if( this.dom.css('position') == 'static' ) this.dom.css('position', 'relative');
            
            //坐标差距
            this.range = {};
            
            this.bindDrag();
        },
        
        bindDrag: function(){
            var t = this;
            
            t.handle.mousedown(function(e){
                t.dragStart(e);
            }).mouseup(function(){
                t.dragStop();
            });
            
            //simple curry bind
            t.curryDrag = (function(){
                return function(){
                    t.drag.apply(t, arguments);
                };
            })();
        },
        
        dragStart: function(e){
            //获取坐标差距
            this.range = {
                x: e.pageX - parseInt(this.dom.css('left') === "auto"  ? 0 : this.dom.css('left')),
                y: e.pageY - parseInt(this.dom.css('top') ==="auto" ? 0 : this.dom.css('top'))
            };
            $(document).mousemove(this.curryDrag);
        },
        
        drag: function(e){
            this.dom.css({
                left: e.pageX - this.range.x,
                top: e.pageY - this.range.y
            });
        },
        
        dragStop: function(){
            $(document).unbind('mousemove', this.curryDrag);
        }
    };

    var old = $.fn.draggable;

    $.fn.draggable = function ( option ) {
        return this.each(function () {
          var $this = $(this)
            , data = $this.data('draggable')
            , options = $.extend({},typeof option == 'object' && option,{dom:this});
          if (!data) $this.data('draggable', (data = new Draggable(options)))
        })
      }

    $.fn.draggable.Constructor = Draggable;

    $.fn.draggable.noConflict = function () {
        $.fn.draggable = old
        return this
    }

    $(document).on('mouseenter.draggable.data-api', '[data-toggle="draggable"]', function (e) {
        target = $(this).attr('data-target');
        target ? $(target).draggable({handle:'[data-toggle]'}) : $(this).draggable();
        // $(this).off(e) 全部mouseenter事件关闭
      })    
}(window.jQuery)