(function(win) {
    var slice = Array.prototype.slice;
    var doc = win.document;
    var Image = win.Image;

    /**
     * video player
     *
     * @constructor
     * @param {Object=} opt options.
     * @param {string=} opt.domId where to place video,
     *              by default is 'videoPlayer'.
     * @param {string=} opt.classPrefix prefix of class,
     *              by default is 'video-player-'.
     * @param {string=} opt.previewPicUrl preview image url.
     * @param {number=} opt.width width,
     *              by default is width of preview image,
     *              if image not set then use 200.
     * @param {number=} opt.height height,
     *              by default is height of preview image,
     *              if image not set then use 200.
     * @param {string=} notSupportHtml
     *              showed when browser not support html5 video.
     */
    var VideoPlayer = function(opt) {
        opt = opt || {};
        this._dom = doc.getElementById(opt['domId'] || 'videoPlayer');
        this._classPrefix = opt['classPrefix'] || 'video-player-';
        this._previewPicUrl = opt['previewPicUrl'] || null;
        this.width = opt['width'] || null;
        this.height = opt['height'] || null;
        this.notSupportHTML = '<b>Your browser not support HTML5 Video!</b>';
        this._init();
    };

    /**
     * init
     */
    VideoPlayer.prototype._init = function() {
        var me = this;
        me.on('imageLoaded', function(w, h, img) {
            me._dom.style['width'] = w;
            me._dom.style['height'] = h;
            if (img) {
                me._dom.appendChild(img);
            }
            me._dom.addEventListener('click', function(e) {
                me.play();
            }, false);
            me.fire('loaded');
        });
        me._loadImg();
    };

    VideoPlayer.prototype._loadImg = function() {
        var me = this;
        if (me._previewPicUrl) {
            var img = new Image();
            if (me.width) {
                img.width = me.width;
            }
            if (me.height) {
                img.height = me.height;
            }
            img.onload = function() {
                me.fire('imageLoaded', img.width, img.height, img);
            };
            img.onabort = img.onerror = function() {
                img = null;
                me.fire('imageLoaded', me.width, me.height);
            };
            img.src = me._previewPicUrl;
        } else {
            me.fire('imageLoaded', me.width, me.height);
        }
    };

    VideoPlayer.prototype.play = function() {

    };

    VideoPlayer.support = function() {
        return true;
    };

    /**
     * 注册事件
     * @param {string} name 事件名
     * @param {function} callback 事件的回调函数
     * @param {object} context 【可选】回调函数的this值
     * @return {object} this
     */
    VideoPlayer.prototype.on = function(name, callback, context) {
        this.eventQueue = this.eventQueue || {};
        this.eventQueue[name] = this.eventQueue[name] || [];
        this.eventQueue[name].push({
            callback: callback,
            context: context
        });
        return this;
    };
    /**
     * 取消注册事件
     * @param {string} name
     * @param {function} callback 【可选】指定要取消的回调函数
     * @return {object} this
     */
    VideoPlayer.prototype.off = function(name, callback) {
        this.eventQueue = this.eventQueue || {};
        if (this.eventQueue[name] == null) {
            return;
        }
        if (callback) {
            var q = this.eventQueue[name];
            var filter = function(value) {
                return value.callback !== callback;
            };
            for (var l = q.length - 1; l >= 0; l--) {
                if (filter(q[l]) === false) {
                    q.splice(l, 1);
                }
            }
            if (q.length === 0) {
                delete this.eventQueue[name];
            }
        } else {
            delete this.eventQueue[name];
        }
        return this;
    };
    /**
     * 激活事件
     * @param {string} name
     * @param {object} data 传递给事件回调函数的参数值
     * @return {object} this
     */
    VideoPlayer.prototype.fire = function(name, data) {
        this.eventQueue = this.eventQueue || {};
        var q = this.eventQueue[name],
            r = true;
        if (q) {
            var arg = slice.call(arguments, 1);
            var me = this;
            var each = function(value) {
                if (value.callback.apply(value.context, arg) === false) {
                    r = false;
                }
            };
            for (var i = 0, l = q.length; i < l; i++) {
                each(q[i]);
            }
        }
        return r;
    };
})(window);
