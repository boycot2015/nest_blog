$(function () {
    //获取模板规则<script>标签;
    var layoutTemp = commonObj.getTpl("./template/layout.html");
    var audioPlayer = $('#play-audio')[0];

    audioPlayer.load()
    var layOutConfig = {
        setStatus: function (currentTime, curStr, endStr, duration) {
            var left = 0;
            duration = duration || 1;
            if (commonObj.progressPsition) {
                left = commonObj.progressPsition.left
            }
            left = currentTime * $('.progress .progress-bar').width() / duration;
            // console.log(currentTime, duration);
            left = Math.abs(left);
            if (audioPlayer.loop && !currentTime) {
                $('.js-play').removeClass('play')
                setTimeout(function () {
                    $('.js-play').addClass('play');
                }, 1000);
            }
            if (commonObj.playData.ended) {
                audioPlayer.pause()
                $('.js-play').removeClass('play')
                // console.log(commonObj.playData.loop);
                if (commonObj.playData.loop) {
                    audioPlayer.play();
                    $('.js-play').addClass('play');
                    audioPlayer.loop = true;
                }
            }
            left = left > commonObj.maxPlayWidth ? commonObj.maxPlayWidth : left;
            currentTime <= 0 && $('.progress .end-time').html(endStr)
            $('.progress .progress-bar .point').css('left', left)
            $('.progress .progress-bar .js-line').css('width', left)
            $('.progress .start-time').html(curStr)
        },
        setVolume: function (left, width) {
            if (!left && !width) {
                audioPlayer.volume = 0.5;
                $('.volume .progress-bar .point').css('left', 42);
                $('.volume .progress-bar .line').width(50);
                return true
            }
            var volume = Math.abs(left / width);
            volume = volume > 1 ? 1 : volume;
            audioPlayer.volume = volume;
            commonObj.playData.volume = volume
            volume <= 0 ? $('.js-music-volume').addClass('close') : $('.js-music-volume').removeClass('close')
        },
        initDrag: function () {
            // 设置窗口可拖动
            commonObj.drag({
                obj: $('.js-music-box .header')[0],
                target: $('.js-music-box')[0],
                cancelElem: $('.js-music-box .header').children().not('.logo')
            })
            // 设置进度条可拖动
            commonObj.drag({
                obj: $('.progress .progress-bar .point')[0],
                site: commonObj.audioTimePos,
                fn: function (position) {
                    commonObj.progressPsition = position;
                    $('.progress .start-time').html(commonObj.playData.curStr);
                    $('.progress .progress-bar .line').width(position.left);
                    audioPlayer.pause()
                    audioPlayer.currentTime = position.left / $('.progress .progress-bar').width() * commonObj.playData.duration;
                },
                end: function (position) {
                    $('.progress .start-time').html(commonObj.playData.curStr);
                    $('.progress .progress-bar .line').width(commonObj.progressPsition.left);
                    $('.js-play').hasClass('play') && audioPlayer.play()
                    audioPlayer.currentTime = commonObj.progressPsition.left / $('.progress .progress-bar').width() * commonObj.playData.duration;
                }
            })
            // 设置mini窗口可拖动
            commonObj.drag({
                obj: $('.js-mini-music-box')[0],
                cancelElem: $('.js-mini-music-box').find('.more, .volume')
            })
        }
    }
    commonObj.initPlayer(audioPlayer, layOutConfig.setStatus, layOutConfig.setVolume)
    layOutConfig.initDrag()
    // 缩放窗口设置主体位置
    window.addEventListener('resize', function (e) {
        layOutConfig.initDrag()
        var dmW = document.documentElement.clientWidth || document.body.clientWidth
        var dmH = document.documentElement.clientHeight || document.body.clientHeight
        $('.js-music-box').css('left', (dmW - $('.js-music-box').width()) / 2)
        $('.js-music-box').css('top', (dmH - $('.js-music-box').height()) / 2)
        $('.js-mini-music-box').css('left', (dmW - $('.js-mini-music-box').width()) / 2)
        $('.js-mini-music-box').css('top', (dmH - $('.js-mini-music-box').height()) / 2)
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
    // 2.音量进度条js
    $('.volume .progress-bar').click(function (e) {
        var left = e.offsetX
        if (commonObj.progressPsition) {
            left = commonObj.progressPsition.left
        }
        $('.volume .progress-bar .point').css('left', left)
        layOutConfig.setVolume(left, commonObj.maxVolumeWidth)
        left = e.offsetX > 8 ? left + 8 : left;
        $('.volume .progress-bar .js-line').width(left)
        commonObj.progressPsition = ''
    })
    $('.volume .progress-bar').mouseenter(function () {
        $(this).find('.point').show()
    }).mouseleave(function () {
        $(this).find('.point').hide()
    })
    commonObj.drag({
        obj: $('.volume .progress-bar .point')[0],
        site: commonObj.audioVolumePos,
        fn: function (position) {
            commonObj.progressPsition = position
            var left = position.left
            layOutConfig.setVolume(left, commonObj.maxVolumeWidth)
            left = left > 8 ? left + 8 : left
            $('.volume .progress-bar .line').width(left)
        }
    })
    $('.js-music-volume').click(function () {
        var width = parseInt($('.volume .progress-bar .line').css('width'))
        var left = commonObj.progressPsition.left
        $(this).toggleClass('close')
        if (!width) {
            $('.volume .progress-bar .line').width(left)
            layOutConfig.setVolume(left, commonObj.maxVolumeWidth)
            left = left > 8 ? left - 8 : left
            $('.volume .progress-bar .point').css('left', left)
        } else {
            commonObj.progressPsition = {
                left: width
            }
            audioPlayer.volume = 0;
            $('.volume .progress-bar .point').css('left', 0);
            $('.volume .progress-bar .line').width(0);
        }
    })
    // 3.播放顺序
    $('.order-icon').click(function (e) {
        // if ($(this).hasClass('icon-music-beckoning')) {
        //     return
        // }
        commonObj.playData.loop = false;
        audioPlayer.loop = false;
        if ($(this).hasClass('icon-music-loop')) {
            commonObj.playData.loop = true;
            $(this).addClass('icon-music-loop-one').removeClass('icon-music-loop icon-music-loop-random')
        } else if ($(this).hasClass('icon-music-loop-one')) {
            $(this).addClass('icon-music-loop-random').removeClass('icon-music-loop icon-music-loop-one')
        } else if ($(this).hasClass('icon-music-loop-random')) {
            $(this).addClass('icon-music-loop').removeClass('icon-music-loop-one icon-music-loop-random')
        } else {
            $(this).addClass('icon-music-loop')
        }
        // console.log(commonObj.playData.loop, 'loop');
    })

    /**
     * mini-box
     */
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

    $('.js-mini-music-box').dblclick(function (e) {
        if ($(e.target).closest($('.more')).length) return;
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
        $('.js-play').toggleClass('play')
        if (!$('.js-play').hasClass('play')) {
            audioPlayer.play()
            $('.music-list-item.play').removeClass('play').addClass('pause')
        } else {
            $('.music-list-item.pause').removeClass('pause').addClass('play')
            audioPlayer.pause()
        }
    })
    $('.js-mini-music-list').on('click', '.music-list-item', function () {
        $(this).addClass('active').siblings().not('.play, .pause').removeClass('active')
    })
    $('.js-mini-music-list').on('dblclick', '.music-list-item', function () {
        $(this).addClass('active play').siblings().removeClass('play active pause');
        $('.js-play').addClass('play');
        audioPlayer.src = commonObj.playData.src;
        audioPlayer.volume = commonObj.playData.volume
        audioPlayer.play();
    })
    $('.js-min-music-volume').click(function () {
        $(this).parent().find('.volume').toggle()
    })

    $('.js-love-icon').click(function () {
        if ($('.js-love-icon').hasClass('icon-music-love')) {
            $('.js-love-icon').addClass('icon-music-love-full').removeClass('icon-music-love')
        } else {
            $('.js-love-icon').addClass('icon-music-love').removeClass('icon-music-love-full')
        }
    })
})