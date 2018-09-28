var rating = (function() {
    //类式继承
    var extend = function(subClass, superClass) {
        var F = function() {};
        F.prototype = superClass.prototype;
        subClass.prototype = new F();
        subClass.prototype.construtor = subClass;
    }

    //点亮(抽象父类)
    var Light = function(ele, options) {
        this.$ele = $(ele);
        this.$star = this.$ele.find('.star');
        this.ops = options;
        this.add = 1;
        this.selectEvent = 'mouseover';
    };

    Light.prototype.init = function() {
        this.lightOn(this.ops.num); // 初始点亮num（半）颗星
        if (!this.ops.readOnly) { // 如果没有配置只读选项，则绑定事件
            this.bindEvent();
        }
    }
    // 初始点亮前num个星星
    Light.prototype.lightOn = function(num) {
        num = parseInt(num);
        this.$star.each(function(index) {
            if (index < num) {
                $(this).css('background-position', '0 -40px');
            } else {
                $(this).css('background-position', '0 0');
            }
        })
    }

    Light.prototype.bindEvent = function() {
        var that = this;
        var starLen = that.$star.length;
        this.$ele.on(that.selectEvent, '.star', function(ev) {
            var num = 0;
            var $this = $(this);
            that.select(ev, $this);
            num = $(this).index() + that.add;
            that.lightOn(num);
            (typeof that.ops.select === 'function') && that.ops.select.call(this, num, starLen);
            // that.$ele.trigger('select',[num, starLen]);
        }).on('click', '.star', function() {
            that.ops.num = $(this).index() + that.add;
            (typeof that.ops.chosen === 'function') && that.ops.chosen.call(this, that.ops.num, starLen);
            //that.$ele.trigger('chosen',[num, starLen]);
        }).on('mouseout', function() {
            that.lightOn(that.ops.num);
        });
    }

    Light.prototype.select = function() {
        throw new Error('子类必须重写该方法！');
    }

    //点亮整颗
    var LightEntire = function(ele, options) {
        Light.call(this, ele, options);
        // this.selectEvent = 'mouseover';
    };

    extend(LightEntire, Light);

    // LightEntire.prototype.lightOn = function(num) {
    //     Light.prototype.lightOn.call(this, num);
    // }
    LightEntire.prototype.select = function() {}; // 基类中说的子类需要重写的方法

    //点亮半颗
    var LightHalf = function(ele, options) {
        Light.call(this, ele, options);
        // this.selectEvent = 'mousemove';  // 这里可以用基类的属性
    };
    extend(LightHalf, Light);
    LightHalf.prototype.lightOn = function(num) {
        var count = parseInt(num);
        var isHalf = count !== num;

        Light.prototype.lightOn.call(this, num);

        if (isHalf) {
            this.$star.eq(count).css('background-position', '0 -80px');
        }
    }

    LightHalf.prototype.select = function(ev, $this) {
        if (ev.pageX - $this.offset().left < $this.width() / 2) {
            this.add = 0.5; //半颗
        } else {
            this.add = 1; //整颗
        }
        num = $(this).index() + this.add;
    }

    //默认参数
    var defaults = {
        mode: 'LightEntire',
        num: 0,
        readOnly: false,
        select: function() {},
        chosen: function() {}
    };
    var mode = { //字符串到函数的映射
        'LightEntire': LightEntire,
        'LightHalf': LightHalf
    };

    //初始化
    var init = function(ele, options) {
        options = $.extend({}, defaults, options); // 合并defaults、options到{}中并返回结果，写插件的重要方法
        if (!mode[options.mode]) { //容错,如果配置项的mode乱写，默认点亮整颗
            options.mode = 'LightEntire';
        }
        //new LightEntire(ele, options).init();
        //new LightHalf(ele, options).init();
        new mode[options.mode](ele, options).init();
    };

    return {
        init: init
    }
})();

rating.init('#stars', { //配置项
    mode: 'LightHalf',
    num: 2.5,
    select: function(num, total) {
        console.log(this);
        console.log(num + '/' + total);
    },
    chosen: function(num, total) {
        console.log(num + '/' + total);
    }
});
rating.init('#stars2', { //配置项
    mode: 'LightEntire',
    num: 2,
    // readOnly: true
});
