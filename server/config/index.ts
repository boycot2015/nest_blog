export class WebConfig {
    static hostName() {
        return 'http://www.boycot.top'
    }
    static clientHostName() {
        return 'http://www.boycot.top'
    }
    static emailOption() {
        return {
            from: 'boycot2017@163.com',
            to: 'boycot2017@163.com',
            subject: '新的评论',
            text: '',
            html: ''
        }
    }
    static newsOption() {
        return {
            listUrl: '/TouTiao/Query?key=%s&type=top',
            queryUrl: '/ActNews/Query?key=%s&keyword=%s&encode=utf8',
            hotWordUrl: '/ActNews/LookUp?key=%s',
            key: '007077bae3d2499ab5ad7b66ffaf818b',
            listKey: '27f22af449a1487bba835e062d08c967',
            hostname : 'api.avatardata.cn'
        }
    }
}