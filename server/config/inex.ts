export class WebConfig {
    static hostName() {
        return 'http://localhost:4000'
    }
    static clientHostName() {
        return 'http://localhost:3001'
    }
    static emailOption() {
        return {
            from: 'boycot2017@163.com',
            to: 'boycot001@163.com',
            subject: '新的评论',
            text: '',
            html: ''
        }
    }
}