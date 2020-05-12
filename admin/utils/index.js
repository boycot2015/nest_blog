import day from 'dayjs'
import CryptoJS from 'crypto-js'
import {
    message
} from 'antd';
import uploader from '@/api/file';
/** created by zch 2019-08-09
 * @description 采用DES对密码进行加密及解密
 */

// DES加密 Pkcs7填充方式
export const encryptByDES = (message, key) => {
    console.log(CryptoJS)
    const keyHex = CryptoJS.enc.Utf8.parse(key)
    const encrypted = CryptoJS.DES.encrypt(message, keyHex, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    })
    return encrypted.ciphertext.toString()
}
// DES解密
export const decryptByDES = (ciphertext, key) => {
    console.log(CryptoJS)
    const keyHex = CryptoJS.enc.Utf8.parse(key)
    // direct decrypt ciphertext
    const decrypted = CryptoJS.DES.decrypt({
        ciphertext: CryptoJS.enc.Hex.parse(ciphertext)
    }, keyHex, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    })
    return decrypted.toString(CryptoJS.enc.Utf8)
}

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
 * @param encrypted 解密字符
 * @param key 解密串
 */
export const aesDecrypt = (encrypted, key) => {
    key = key || '123456'
    const decrypted = CryptoJS.AES.decrypt(encrypted, key);
    return decrypted.toString(CryptoJS.enc.Utf8);
}
export const timeFilter = (value) => {
    value = value.toString()
    if (value) {
        if (value.length === 13) {
            return day(Number(value)).format('YYYY-MM-DD HH:mm:ss')
        }
        return day.unix(Number(value)).format('YYYY-MM-DD HH:mm:ss')
    } else {
        return '-'
    }
}
/** 2020-05-13 by boycot
 * 上传文件
 * @param {*} param 上传的文件
 */
export const uploadFile = async param => {
    if (!param.file) {
        return false;
    }

    let size = param.file.size || 0;

    let hide = () => { };
    if (size > 1024 * 1024 * 4) {
        hide = message.loading('文件上传中...', 0);
    }
    let formdata = new FormData()
    formdata.append('file', param.file)
    formdata.append('name', param.file.uid)
    console.log(param.file, 'param.file')
    const res = await uploader.uploadFile(formdata)
    hide();
    if (res && res.success) {
        return res
    } else {
        message.error('文件上传失败，可能过大！');
    }
};