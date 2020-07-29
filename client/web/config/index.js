const config = {
    sideWhiteRoute: ['/about', '/article/view'],
    about: {
        description: `
        pc端前台项目采用nuxt.js服务端渲染框架，后台管理、server采用 react.js typescript nextjs minio nestjs mysql 编写,
        主要涉及到文章浏览、详情、文章评论几个模块。具体支持特性：`,
        list: [{
            name: '文章',
            value: '创建、分类、标签、预览、发布、编辑、访客访问，以及搜索'
        },
        {
            name: '列表',
            value: '创建、预览、发布'
        },
        {
            name: '评论',
            value: '发布、回复（后台审核通过后可显示）'
        },
        {
            name: '用户',
            value: '访客注册、访客授权'
        },
        {
            name: '文件上传',
            value: '支持上传到本地minio服务器'
        },
        {
            name: '系统设置',
            value: '系统标题、页脚、 SEO 配置、以及邮箱配置等'
        },
        {
            name: '图表展示',
            value: '以图表的形式展示最近的访客量和文章发布记录'
        },
        {
            name: '邮件通知',
            value: '收到新评论时，会邮件通知管理员；评论通过后，会邮件通知被评论人'
        }
        ]
    },
    weatherConfig: {
        appid: '47499825',
        appsecret: 'liyLN9Cq'
    },
    weatherIcons: [
        {
            name: '晴',
            value: 'sunny'
        },
        {
            name: '多云',
            value: 'cloudy'
        },
        {
            name: '雨',
            value: 'rain'
        },
        {
            name: '小雨',
            value: 'rain'
        },
        {
            name: '阵雨',
            value: 'cloudy-rain'
        },
        {
            name: '夜间多云',
            value: 'night'
        },
        {
            name: '中雨',
            value: 'middle-rain'
        },
        {
            name: '阵雨转大雨',
            value: 'heavy-rain'
        },
        {
            name: '暴雨',
            value: 'rainstorm'
        },
        {
            name: '雪',
            value: 'snow'
        },
        {
            name: '雷阵雨',
            value: 'thunder'
        },
        {
            name: '阴',
            value: 'overcast'
        },
        {
            name: '多云转阴',
            value: 'cloudy'
        },
        {
            name: '小雨转阴',
            value: 'rain'
        }
    ],
    getUserIP (onNewIP) { //  获取本机电脑ip
        // compatibility for firefox and chrome
        var MyPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection
        var pc = new MyPeerConnection({
            iceServers: []
        })
        var noop = function () { }
        var localIPs = {}
        var ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g
        var key
        function iterateIP (ip) {
            if (!localIPs[ip]) onNewIP(ip)
            localIPs[ip] = true
        }
        // create a bogus data channel
        pc.createDataChannel('')
        // create offer and set local description
        pc.createOffer().then(function (sdp) {
            sdp.sdp.split('\n').forEach(function (line) {
                if (!line.includes('candidate')) return
                line.match(ipRegex).forEach(iterateIP)
            })
            pc.setLocalDescription(sdp, noop, noop)
        }).catch(function (reason) {
            // An error occurred, so handle the failure to connect
        })
        // sten for candidate events
        pc.onicecandidate = function (ice) {
            if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return
            ice.candidate.candidate.match(ipRegex).forEach(iterateIP)
        }
    }
}
/**
 * 该系统采用 react.js typescript nextjs nestjs mysql 编写。 支持特性：

文章：创建、分类、标签、预览、发布、编辑、访客访问，以及搜索
列表：创建、预览、发布
评论：发布、回复（后台审核通过后可显示）
用户：访客注册、访客授权
文件上传：目前仅支持上传到 阿里云 OSS
邮件通知：收到新评论时，会邮件通知管理员；评论通过后，会邮件通知被评论人
系统设置：系统标题、Logo、favicon、页脚、 SEO 配置、OSS配置以及邮箱配置等
访问及发布记录图表展示：以图表的形式展示最近的访客量和文章发布记录
 */
export default config
