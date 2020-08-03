$(function () {
    var data = [
        {
            name: '推荐',
            icon: 'record',
            unfold: true,
            list: [
                {
                    id: 1,
                    name: '发现音乐',
                    icon: 'music'
                },
                {
                    id: 2,
                    name: '私人FM',
                    icon: 'music'
                },
                {
                    id: 3,
                    name: 'LOOK直播',
                    icon: 'music'
                },
                {
                    id: 4,
                    name: '视频',
                    icon: 'music'
                },
                {
                    id: 5,
                    name: '朋友',
                    icon: 'music'
                }
            ]
        },
        {
            name: '我的音乐',
            icon: 'record',
            unfold: true,
            list: [
                {
                    id: 1,
                    name: '本地音乐',
                    icon: 'music'
                },
                {
                    id: 2,
                    name: '下载管理',
                    icon: 'music'
                },
                {
                    id: 3,
                    name: '我的音乐云盘',
                    icon: 'music'
                },
                {
                    id: 4,
                    name: '我的电台',
                    icon: 'music'
                },
                {
                    id: 5,
                    name: '我的收藏',
                    icon: 'music'
                }
            ]
        },
        {
            name: '创建的歌单',
            icon: 'record',
            list: [
                {
                    id: 1,
                    name: '本地音乐',
                    icon: 'music'
                },
                {
                    id: 2,
                    name: '下载管理',
                    icon: 'music'
                },
                {
                    id: 3,
                    name: '我的音乐云盘',
                    icon: 'music'
                },
                {
                    id: 4,
                    name: '我的电台',
                    icon: 'music'
                },
                {
                    id: 5,
                    name: '我的收藏',
                    icon: 'music'
                }
            ]
        },
        {
            name: '收藏的歌单',
            icon: 'record',
            list: [
                {
                    id: 1,
                    name: '本地音乐',
                    icon: 'music'
                },
                {
                    id: 2,
                    name: '下载管理',
                    icon: 'music'
                },
                {
                    id: 3,
                    name: '我的音乐云盘',
                    icon: 'music'
                },
                {
                    id: 4,
                    name: '我的电台',
                    icon: 'music'
                },
                {
                    id: 5,
                    name: '我的收藏',
                    icon: 'music'
                }
            ]
        }
    ]
    var renderHtml = template('asideTemp', {list: data})
    console.log(renderHtml, 'renderHtml');
    $('.js-aside-template').html(renderHtml)
    $('.js-aside-template').on('click', '.js-toggle-class', function () {
        $(this).toggleClass('active')
        $(this).siblings('.list').toggleClass('active')
    })
    $('.js-aside-template').on('click', '.js-list-item', function () {
        $(this).addClass('active').siblings().removeClass('active').parent().parent().siblings().find('.js-list-item').removeClass('active')
    })
})