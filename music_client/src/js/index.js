$(function () {
    //获取模板规则<script>标签;
    var layoutTemp = getTpl("./template/layout.html");
    var audioPlayer = $('#play-audio')[0];
    var timer = null
    audioPlayer.load()
    var layOutConfig = {
        setStatus: function (currentTime, curStr, endStr, duration) {
            var left = 0;
            if (commonObj.progressPsition) {
                left = commonObj.progressPsition.left
            }
            left = currentTime * $('.progress .progress-bar').width() / duration;
            left = Math.round(left);
            $('.progress .progress-bar .point').css('left', left)
            $('.progress .progress-bar .js-line').css('width', left)
            $('.progress .start-time').html(curStr)
            $('.progress .end-time').html(endStr)
        }
    }
    // 设置窗口可拖动
    drag({
        obj: $('.js-music-box .header')[0],
        target: $('.js-music-box')[0],
        cancelElem: $('.js-music-box .header').children().not('.logo')
    })
    $('.js-mini-music-box .left').mouseenter(function () {
        if ($('.js-mini-music-list').css('display') === 'none') {
            $(this).find('.js-more').stop().slideDown(200)
        }
        $(this).find('.js-play-btn').stop().fadeIn(200)
        $(this).find('.js-play-btn').css('display', 'flex')
    }).mouseleave(function () {
        $(this).find('.js-more').stop().slideUp(200)
        $(this).find('.js-play-btn').stop().fadeOut(200)
    })

    // 渲染头部==================================
    $('.js-music-min').click(function () {
        // console.log(1231231);
        $('.js-music-box').hide().siblings('.js-mini-music-box').show();
    })

    // 渲染左侧菜单=====================================
    $.ajax({
        type: "get",
        dataType: "json",
        data: { json: 1 },
        url: "./json/menu.json",
        success: function (data) {
            // //获取<script>标签内的内容,即拼接字符串的规则;
            var asideTemp = $(layoutTemp).find('#asideTemp').text();
            // console.log(asideTemp, ".find('#asideTemp')");
            // //使用template的render()方法,传入模板及数据生成html片段;
            var renderHtml = template.render(asideTemp, { list: data });
            // //将html片段渲染到页面
            $('.js-aside-template').html(renderHtml)
            $('.js-aside-template').on('click', '.js-toggle-class', function () {
                $(this).toggleClass('active')
                $(this).siblings('.list').toggleClass('active')
            })
            $('.js-aside-template').on('click', '.js-list-item', function () {
                $(this).addClass('active').siblings().removeClass('active').parent().parent().siblings().find('.js-list-item').removeClass('active')
            })
        }
    })
    // 渲染内容===================================


    // 渲染底部===================================

    // 1. 时间进度条js
    $('.progress .progress-bar').click(function (e) {
        var left = e.offsetX
        if (commonObj.progressPsition) {
            left = commonObj.progressPsition.left
        }
        $('.progress .progress-bar .point').css('left', left);
        $('.progress .progress-bar .js-line').css('width', left);
        $('.progress .start-time').html(commonObj.playData.curStr);
        audioPlayer.currentTime = left / $('.progress .progress-bar').width() * commonObj.playData.duration;
        commonObj.progressPsition = '';
    })
    drag({
        obj: $('.progress .progress-bar .point')[0],
        site: {
            l: -4,
            t: -6,
            r: 372,
            b: -4
        },
        fn: function (position) {
            commonObj.progressPsition = position;
            $('.progress .start-time').html(commonObj.playData.curStr);
            $('.progress .progress-bar .line').width(position.left);
            audioPlayer.pause()
            audioPlayer.currentTime = position.left / $('.progress .progress-bar').width() * commonObj.playData.duration;
        },
        end: function (position) {
            $('.progress .start-time').html(commonObj.playData.curStr);
            $('.progress .progress-bar .line').width(position.left);
            audioPlayer.play()
            audioPlayer.currentTime = position.left / $('.progress .progress-bar').width() * commonObj.playData.duration;
        }
    })
    // 2.音量进度条js
    $('.volume .progress-bar').click(function (e) {
        var left = e.offsetX
        if (commonObj.progressPsition) {
            left = commonObj.progressPsition.left
        }
        $('.volume .progress-bar .point').css('left', left)
        left = e.offsetX > 8 ? left + 8 : left
        $('.volume .progress-bar .js-line').width(left)
        console.log(this.commonObj.playData.duration);
        commonObj.progressPsition = ''
    })
    $('.volume .progress-bar').mouseenter(function () {
        $(this).find('.point').show()
    }).mouseleave(function () {
        $(this).find('.point').hide()
    })
    drag({
        obj: $('.volume .progress-bar .point')[0],
        site: {
            l: -4,
            t: -6,
            r: 82,
            b: -4
        },
        fn: function (position) {
            commonObj.progressPsition = position
            var left = position.left
            left = left > 8 ? left + 8 : left
            $('.volume .progress-bar .line').width(left)
        }
    })
    $('.js-music-volume').click(function () {
        var width = parseInt($('.volume .progress-bar .line').css('width'))
        if (!width) {
            $('.volume .progress-bar .point').css('left', commonObj.progressPsition.left)
            $('.volume .progress-bar .line').width(commonObj.progressPsition.left)
        } else {
            commonObj.progressPsition = {
                left: width
            }
            $('.volume .progress-bar .point').css('left', 0)
            $('.volume .progress-bar .line').width(0)
        }
    })

    /**
     * mini-box
     */
    drag({
        obj: $('.js-mini-music-box')[0],
        // target: $('.js-music-box .wrap')[0],
        cancelElem: $('.js-mini-music-box').find('.more')
    })
    $('.js-mini-music-box').dblclick(function () {
        $(this).hide().siblings('.js-music-box').show();
    })
    $('.js-list-icon').click(function () {
        // $(this).hide().siblings('.js-music-box').show();
        var isDown = $('.js-mini-music-list').css('display')
        if (isDown === 'none') {
            $('.js-mini-music-list').slideDown()
        } else {
            $('.js-mini-music-list').slideUp()
        }
    })
    // 播放暂停
    $('.js-play').click(function () {
        clearInterval(timer)
        if (!$('.js-play').hasClass('pause')) {
            timer = setInterval(function () {
                commonObj.getAudioInfo(audioPlayer, layOutConfig.setStatus)
            }, 1000);
            $('#play-audio')[0].play()
        } else {
            clearInterval(timer)
            $('#play-audio')[0].pause()
        }
        $('.js-play').toggleClass('pause')
    })
    commonObj.initPlayer(audioPlayer, layOutConfig.setStatus)
    $('.js-mini-music-list').on('click', '.music-list-item', function () {
        $(this).addClass('active').siblings().removeClass('active')
    })
})