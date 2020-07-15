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
}