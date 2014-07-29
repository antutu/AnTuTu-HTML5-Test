/**
 * 
 * 用于构建地铁线路图样式进度条
 * @type type
 */
var mbProcessBar = {
    items: [],
    content_obj: "",
    currIndex: 0,
    initialize: function(obj) {
        if ($('.proBar').length > 0) {
            $('.proBar').remove();
        }
        
        var BarObject = $('<div></div>').addClass('proBar')
        this.content_obj = $('<article></article>')
        BarObject.append(this.content_obj);
        $(obj).append(BarObject);
        return mbProcessBar;
    },
    add: function(item) {
        if (!item['color']) {
            item['color'] = 'yellow';
        }
        if ($('.proBar').length == 0) {
            mbProcessBar.initialize($('.content_bar'))
        }
        this.items[this.items.length] = item;

        return mbProcessBar;
    },
    find:function(name){
        for (var i = 0; i < this.items.length; i++) {
            var item = this.items[i]
            if (item['label']==name){
                break;
            }
        }
        if (i!==-1){
            this.active(i);
        }
    },
    active: function(i) {
        $('.proBar span.point-curr-icon').removeClass('point-curr-icon');

        $($('.proBar span.point-time')[i]).removeClass().addClass('point-time point-curr-icon').addClass('point-green');

        return mbProcessBar;
    },
    next: function() {
        if ((this.currIndex + 1) >= this.items.length) {
            this.currIndex = 0;
        } else {
            this.currIndex++;
        }
        this.active(this.currIndex);
    }
    ,
    show: function() {
        for (var i = 0; i < this.items.length; i++) {
            var item = this.items[i]
            var section = $('<section></section>');

            var point = $('<span></span>').addClass('point-time').addClass('point-' + item['color']);
            section.append(point)
            if (item['title']){
                section.append($('<time></time>').html('<span>'+item['title']+'</span>'));
            }
            
            var aside = $('<aside></aside>').append($('<p></p>').addClass('things').html(item['label']));
            section.append(aside);
            this.content_obj.append(section);
        }

        return mbProcessBar;
    }
}


var mbProcessBar=mbProcessBar;