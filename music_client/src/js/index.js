$(function () {
    //获取模板规则<script>标签;
    var layoutTemp = commonObj.getTpl("./template/layout.html");
    var audioPlayer = $('#play-audio')[0];
    audioPlayer.load()

    var layOutConfig = { // 整体架构数据配置
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
            // 设置时长进度条可拖动
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
            // 设置音量进度条可拖动
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
        },
        getData: {
            init: function () {
                // 渲染左侧菜单=====================================
                this.getMenu();
                this.getList(function (res) {
                    // //获取<script>标签内的内容,即拼接字符串的规则;
                    var listTemp = $(layoutTemp).find('#listTemp').text();
                    // console.log(listTemp, ".find('#listTemp')");
                    // //使用template的render()方法,传入模板及数据生成html片段;
                    var srcList = []
                    res.tracks.forEach(function (item, i) {
                        var min = Math.floor(item.dt / 60 / 1000);
                        var second = Math.round(item.dt / 1000 % 60);
                        min = min < 10 ? '0' + min : min;
                        second = second < 10 ? '0' + second : second;
                        item.time = min + ':' + second;
                        item.src = 'http://m10.music.126.net/20200807094723/c03a9d05ed395a612e4e1ae62930c0b7/yyaac/obj/wonDkMOGw6XDiTHCmMOi/3355922236/ab61/828a/4c8d/b614204ea9081dcf6db1722c5fa7f398.m4a'
                        $.ajax({
                            type: "post",
                            dataType: "jsonp",
                            data: {
                                encSecKey: 'dc67e18ee269b205c7e1513af52d3f2a617cbed3b14dd4c44473a232bfcb73a608a92834498cd6d7d29b0d63456ed68e38ec5e983af02f5e5a1ba024aab66e0caad59bd59d676f6d5898bc1cb566ff10b169563fd7d55363403b9566f4920162624c8d3a7ef14195cdeccf04bd4796089cb5a280e5f585e7856382ee652e2d9a',
                                params: 'OCCN9ASTI2yP8n7W5XaoI4dFa4Av5Q9qkJ3F4KOc+X/XvbYL4UM28VgZ/ixbPlK12AxjoL9cvhB1s1dlvghV3Lo281zxHK0fC2h6WCU+DGT+/9R+Ze5Lq4zLCWC7/9EnesQGXrB1os64NfSN8qCKmrizh4hgRhA0TVs4Y8sveojL8tOnzPU2M40y1OV0r9npExt/3EKbstQAano86CIsSg=='
                            },
                            url: 'https://music.163.com/weapi/song/enhance/player/url/v1?csrf_token=9dba65809e6f815a53a1d59f6169cf5f',
                            success: function (res) {
                                srcList.push(res.data.data)
                                console.log(srcList, 'srcList')
                            }
                        })
                    })
                    var renderHtml = template.render(listTemp, { list: res.tracks, page: res.size });
                    $('.js-footer-music-list').html(renderHtml)
                    var renderHtml = template.render(listTemp, { list: res.tracks });
                    // //将html片段渲染到页面
                    $('.js-music-list').html(renderHtml)
                    commonObj.data = res
                });
            },
            getMenu: function () {
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
            },
            getList: function (callback) {
                // 渲染歌曲列表=====================================
                $.ajax({
                    type: "get",
                    dataType: "json",
                    data: { json: 1 },
                    url: "./json/list.json",
                    success: function (res) {
                        callback(res)
                    }
                })
            }
        },
        setCurrentData: function (playData) {
            console.log(playData);
            $('.js-mini-music-box').find('img').attr('src', playData.picUrl);
            $('.js-music-box .music-info').find('img').attr('src', playData.picUrl);
            $('.js-music-box .music-info .name').html(playData.name).parent().siblings().find('.singer').html(playData.singer);
            $('.js-mini-music-box').find('.left .more .name').html(playData.name).siblings('.singer').html(playData.singer);
        }
    }
    commonObj.initPlayer(audioPlayer, layOutConfig.setStatus, layOutConfig.setVolume)
    layOutConfig.initDrag()
    layOutConfig.getData.init()
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
    // window.addEventListener('mousedown', function(){
    //     audioPlayer.muted = false;
    // }, false);

    // 渲染头部==================================
    $('.js-music-min').click(function () {
        // console.log(1231231);
        $('.js-music-box').hide().siblings('.js-mini-music-box').show();
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

    // 4. 底部列表展示与收起
    $('.js-play-list-btn').click(function () {
        $(this).parent().find('.js-play-list').toggle()
    })
    $('.js-list-close').click(function () {
        $(this).parent().parent().hide()
    })
    $('.js-list-btn, .js-history-btn').click(function () {
        $(this).addClass('active').siblings().removeClass('active')
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
            $('.js-mini-music-list').slideDown(200)
        } else {
            $('.js-mini-music-list').slideUp(200)
        }
    })
    // 播放暂停
    $('.js-play').click(function () {
        if (!$('.js-play').hasClass('play')) {
            audioPlayer.play()
            $('.music-list-item.play').removeClass('play').addClass('pause')
        } else {
            $('.music-list-item.pause').removeClass('pause').addClass('play')
            audioPlayer.pause()
        }
        $('.js-play').toggleClass('play')
    })
    $('.js-mini-music-list, .js-footer-music-list').on('click', '.music-list-item', function () {
        $(this).addClass('active').siblings().removeClass('active')
    })
    $('.js-mini-music-list, .js-footer-music-list').on('dblclick', '.music-list-item', function () {
        var _this = $(this);
        commonObj.data.tracks.forEach(function (item, i) {
            if (item.id == _this.attr('data-id')) {
                audioPlayer.muted = false;
                audioPlayer.src = item.src;
                commonObj.playData.id = item.id;
                commonObj.playData.name = item.name;
                commonObj.playData.singer = '';
                item.ar.forEach(function (singer, cindex) {
                    commonObj.playData.singer += singer.name + ((cindex < item.ar.length - 1) ? '/' : '');
                })
                commonObj.playData.picUrl = item.al.picUrl;
            }
        })
        layOutConfig.setCurrentData(commonObj.playData)
        // audioPlayer.volume = commonObj.playData.volume
        var listDom = $('.js-mini-music-list, .js-footer-music-list').find('.music-list-item');
        listDom.each(function (i, e) {
            if ($(this).attr('data-id') == commonObj.playData.id) {
                $(this).removeClass('pause').addClass('play active').siblings().removeClass('play active pause');
            }
        })
        $('.js-play').addClass('play');
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