// 定义公共方法
var commonObj = {
    timer: null,
    progressPsition: '', // 进度条位置
    maxPlayWidth: 372,
    audioTimePos: {
        l: -4,
        t: -6,
        r: 372,
        b: -4
    },
    audioVolumePos: {
        l: -4,
        t: -6,
        r: 82,
        b: -4
    },
    maxVolumeWidth: 82,
    playData: {
        src: '/src/source/前世今生-文武贝钢琴版.mp3',
        name: '至尊宝',
        singer: '徐良/杨威',
        coverImg: '/dist/images/avatar.jpg',
        volume: 0.5,
        loop: false,
        ended: false,
        muted: false,
        currentTime: 0,
        duration: 0,
    },
    data: {},
    TemplateEngine: function (html, options) {
        var re = /<%([^%>]+)?%>/g, reExp = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g, code = 'var r=[];\n', cursor = 0;
        var add = function (line, js) {
            js ? (code += line.match(reExp) ? line + '\n' : 'r.push(' + line + ');\n') :
                (code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
            return add;
        }
        while (match = re.exec(html)) {
            add(html.slice(cursor, match.index))(match[1], true);
            cursor = match.index + match[0].length;
        }
        add(html.substr(cursor, html.length - cursor));
        code += 'return r.join("");';
        return new Function(code.replace(/[\r\t\n]/g, '')).apply(options);
    },
    //传入参数为文件路径,return 出返回值的responseText文本
    getTpl: function (fileUrl) {
        var result = $.ajax({
            type: "GET",
            url: fileUrl,
            async: false
        });
        return result.responseText;
    },
    getAudioInfo: function (_audio, call) {
        var time = _audio.duration || 0;
        var min = parseInt(time / 60);
        var second = parseInt(time % 60);
        var currentTime = _audio.currentTime;
        var duration = min * 60 + second;
        min = min < 10 ? '0' + min : min;
        second = second < 10 ? '0' + second : second;
        var endStr = min + ':' + second;
        min = Math.round(currentTime) > 59 ? (Math.round(currentTime / 60) < 10 ? ('0' + parseInt(currentTime / 60)) : Math.round(currentTime / 60)) : '00';
        second = parseInt(currentTime % 60) < 10 ? ('0' + parseInt(currentTime % 60)) : parseInt(currentTime % 60);
        second = second == 60 ? '00' : second;
        var curStr = min + ':' + second;
        this.playData.src = _audio.src;
        this.playData.volume = _audio.volume;
        this.playData.ended = _audio.ended;
        this.playData.muted = _audio.muted;
        this.playData.curStr = curStr;
        this.playData.endStr = endStr;
        this.playData.duration = duration;
        this.playData.currentTime = parseInt(currentTime);
        if (call) call(parseInt(currentTime), curStr, endStr, duration);
    },
    initPlayer: function (audioPlayer, setStatus, setVolume) {
        //进度事件监听
        audioPlayer.addEventListener('timeupdate', function () {
            commonObj.getAudioInfo(audioPlayer, setStatus);
        })
        //加载事件监听
        audioPlayer.addEventListener('loadedmetadata', function () {
            // setVolume()
            commonObj.getAudioInfo(audioPlayer, setStatus);
        })
        //结束事件监听
        audioPlayer.addEventListener('ended', function () {
            commonObj.getAudioInfo(audioPlayer, setStatus)
            clearInterval(commonObj.timer)
        })
    },
    drag: function (options) {
        var obj = options.obj,
            target = options.target || options.obj,
            site = options.site || {},
            fn = options.fn,
            cancelElem = options.cancelElem;
        var dmW = document.documentElement.clientWidth || document.body.clientWidth
        var dmH = document.documentElement.clientHeight || document.body.clientHeight
        site = site || {};
        var adsorb = site.n || 0;              //磁性吸附的吸附范围
        var l = site.l || 0;
        var r = (site.r || site.r == 0) ? site.r : dmW - target.offsetWidth;
        var t = site.t || 0;
        var b = (site.b || site.b == 0) ? site.b : dmH - target.offsetHeight;
        obj.onmousedown = function (ev) {
            r = (site.r || site.r == 0) ? site.r : dmW - target.offsetWidth;
            b = (site.b || site.b == 0) ? site.b : dmH - target.offsetHeight;
            var oEvent = ev || event;
            var siteX = oEvent.clientX - target.offsetLeft;
            var siteY = oEvent.clientY - target.offsetTop;
            ev.stopPropagation();
            // 获取需要排除的元素
            var elemCancel = $(ev.target).closest(cancelElem);
            // 如果拖拽的是排除元素，函数返回
            if (elemCancel.length) {
                return true;
            }
            if (obj.setCapture) { //兼容IE低版本的阻止默认行为，并实现事件捕获
                obj.onmousemove = move;
                obj.onmouseup = up;
                obj.setCapture();
            } else {
                document.onmousemove = move;
                document.onmouseup = up;
            }
            function move (ev) {
                var oEvent = ev || event;
                var iLeft = oEvent.clientX - siteX;
                var iTop = oEvent.clientY - siteY;
                ev.stopPropagation();
                if (iLeft <= l + adsorb) {              //限制拖动范围
                    iLeft = 0;
                }
                if (iLeft >= r - adsorb) {
                    iLeft = r;
                }
                if (iTop <= t + adsorb) {
                    iTop = 0;
                }
                if (iTop >= b - adsorb) {
                    iTop = b;
                }
                if (fn) {                         //执行回调函数，如果有其他附加情况需要处理
                    fn({ left: iLeft, top: iTop })
                }
                $(obj).find('.point').show()
                $('.js-mini-music-box').find('.volume').hide()
                target.style.left = iLeft + 'px';
                target.style.top = iTop + 'px';
            }
            function up () {
                var oEvent = ev || event;
                var iLeft = oEvent.clientX - siteX;
                var iTop = oEvent.clientY - siteY;
                if (obj.setCapture) {            //拖放结束后释放捕获
                    obj.releaseCapture();
                }
                if (options.end) options.end({ left: iLeft, top: iTop })
                this.onmousemove = null;
                this.onmouseup = null;
                this.onclick = null;
            }
            return false;
        }
    }
}