$(function () {
    //获取模板规则<script>标签;
    var layoutTemp = getTpl("./template/layout.html");
    // 设置窗口可拖动
    drag($('.music-box .header')[0], $('.music-box')[0], {
        // l: $('.box').offset().left,
        // t: $('.box').offset().top
    })
    // 渲染头部==================================

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

    // 1. 进度条js
    $('.progress .progress-bar').click(function(e) {
        var left = e.offsetX
        if (commonObj.progressPsition) {
            left = commonObj.progressPsition.left
        }
        $('.progress .progress-bar .point').css('left', left)
        $('.progress .progress-bar .js-line').css('width', left)
        commonObj.progressPsition = ''
    })
    drag(
        $('.progress .progress-bar .point')[0],
        $('.progress .progress-bar .point')[0], {
        l: -4,
        t: -6,
        r: 372,
        b: -4
    }, function (position) {
        commonObj.progressPsition = position
        $('.progress .progress-bar .line').width(position.left)
    })
    // 2.音量js
    $('.volume .volume-bar').click(function(e) {
        var left = e.offsetX
        if (commonObj.progressPsition) {
            left = commonObj.progressPsition.left
        }
        $('.volume .volume-bar .point').css('left', left)
        $('.volume .volume-bar .js-line').css('width', left)
        commonObj.progressPsition = ''
    })
    drag(
        $('.volume .progress-bar .point')[0],
        $('.volume .progress-bar .point')[0], {
        l: -4,
        t: -6,
        r: 82,
        b: -4
    }, function (position) {
        commonObj.progressPsition = position
        $('.volume .progress-bar .line').width(position.left)
    })
})