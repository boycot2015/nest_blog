
const nodemailer = require("nodemailer");
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
const smtpTransport = nodemailer.createTransport({
    service: '163',
    // host: "smtp.163.com",
    // secureConnection: true, // use SSL
    // port: 25, // port for secure SMTP
    auth: {
        // user: 'boycot2017@163.com',
        // pass: 'GIZNBKXISKNIQJSE'//注：此处为授权码，并非邮箱密码
        user: 'boycot001@163.com',
        pass: 'IAKKRWWTCZCOPYON'
    }
});

// export const sendMail = (sendOption, callback) => {
//     smtpTransport.sendMail(sendOption, callback);
// }

smtpTransport.sendMail({
    from: 'boycot2017@163.com',
    to: 'boycot001@163.com',
    subject: '新的评论',
    text: '',
    html: 'Hi!'
}, (res, err) => {
    console.log(res, err)
})