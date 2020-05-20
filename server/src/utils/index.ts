// import CryptoJS from 'crypto-js'
import * as day from 'dayjs'
import * as CryptoJS from 'crypto-js';
const UAParser = require('ua-parser-js');
const nodemailer = require("nodemailer");


// AES加密解密
/**
 * AES加密
 * @param data 加密字符
 * @param key 加密串
 */
export const aesEncrypt = (data, key) => {
    key = key || '123456'
    const cipher = CryptoJS.AES.encrypt(data, key);
    return cipher.toString();
}
/**
 * AES解密
 * @param encrypted 加密字符
 * @param key 解密串
 */
export const aesDecrypt = (encrypted, key) => {
    key = key || '123456'
    const decrypted = CryptoJS.AES.decrypt(encrypted, key);
    return decrypted.toString(CryptoJS.enc.Utf8);
}
export const responseStatus = {
    success: {
        code: 200,
        message: '操作成功！'
    },
    failed: {
        code: 400,
        message: '操作失败！'
    },
    unAuth: {
        code: 401,
        message: '无权限进行此操作！'
    }
}

/**
 * 格式化时间戳（秒|毫秒）
 * @param {timestamp} value
 */
export const timeFormat = (value, timeStr: Required<string>) => {
    value = value.toString()
    timeStr = timeStr || 'YYYY-MM-DD HH:mm:ss'
    if (value) {
        if (value.length === 13) {
            return day(Number(value)).format(timeStr)
        }
        return day.unix(Number(value)).format(timeStr)
    } else {
        return '-'
    }
}
/** 2020-05-17
 * 根请求头获取ip
 * @param req 
 */
export function getClientIP(req) {
    const ip =
        req.headers['x-real-ip'] ||
        req.headers['x-forwarded-for'] || // 判断是否有反向代理 IP
        (req.connection && req.connection.remoteAddress) || // 判断 connection 的远程 IP
        (req.socket && req.socket.remoteAddress) || // 判断后端的 socket 的 IP
        (req.connection &&
            req.connection.socket &&
            req.connection.socket.remoteAddress);
    // console.log(req.connection.remoteAddress, 'ipipipipipipipipipipipipipipipip')
    return ip.split(':').pop();
}
/** 2020-05-17
 * 获取浏览器信息
 * @param userAgent 浏览器信息
 */
export const parseUserAgent = (userAgent) => {
    const uaparser = new UAParser();
    uaparser.setUA(userAgent);
    const uaInfo = uaparser.getResult();
    let msg = `${uaInfo.browser.name || ''} ${uaInfo.browser.version || ''} `;
    msg += ` ${uaInfo.os.name || ''}  ${uaInfo.os.version || ''} `;
    msg += `${uaInfo.device.vendor || ''} ${uaInfo.device.model || ''} ${uaInfo
        .device.type || ''}`;
    return msg;
};

/**
 * 递归实现树形结构
 * @param {*} data 需要递归的数组
 * @param {*} parentViewCode 递归条件
 */
export function filterTreeData (data, parentId = null) {
    let tree = []
    let temp
    for (let i = 0; i < data.length; i++) {
        if (data[i].parentId === parentId) {
            let obj = data[i]
            temp = filterTreeData(data, data[i].id)
            if (temp.length > 0) {
                obj.children = temp
            }
            tree.push(obj)
        }
    }
    return tree
}

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
    auth: {
        // user: 'boycot2017@163.com',
        // pass: 'GIZNBKXISKNIQJSE'//注：此处为授权码，并非邮箱密码
        user: 'boycot001@163.com',
        pass: 'IAKKRWWTCZCOPYON'
    }
});

export const sendMail = (sendOption, callback) => {
    smtpTransport.sendMail(sendOption, callback);
}

