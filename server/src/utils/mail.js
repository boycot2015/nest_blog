const nodemailer = require("nodemailer");
const smtpTransport = nodemailer.createTransport({
    service: '163',
    auth: {
        user: 'boycot2017@163.com',
        pass: 'zch17184'//注：此处为授权码，并非邮箱密码
    }
});

/** 发送电子邮箱
 * sendOption = {
        from    : 'boycot2017@163.com',//发件人邮箱
        to      : '*@*,*@*',//收件人邮箱，多个邮箱地址间用','隔开
        subject : 'title',//邮件主题
        text: 'Hi!'//text和html两者只支持一种
    }
    callback = function(err, res) {
        console.log(err, res);
    }
 * @param {*} sendOption 发送的配置项
 * @param {*} callback 发送成功回调
 */
export const sendMail = (sendOption, callback) => {
    smtpTransport.sendMail(sendOption, callback);
}