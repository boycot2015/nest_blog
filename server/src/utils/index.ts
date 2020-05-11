// import CryptoJS from 'crypto-js'
import * as CryptoJS from 'crypto-js';
// const CryptoJS = { AES, mode, pad, enc }
/** created by zch 2019-08-09
 * @description 采用DES对密码进行加密及解密
 */

// // DES加密 Pkcs7填充方式
// export const encryptByDES = (message, key) => {
//     console.log(CryptoJS)
//     const keyHex = CryptoJS.enc.Utf8.parse(key)
//     const encrypted = CryptoJS.DES.encrypt(message, keyHex, {
//         mode: CryptoJS.mode.ECB,
//         padding: CryptoJS.pad.Pkcs7
//     })
//     return encrypted.ciphertext.toString()
// }
// // DES解密
// export const decryptByDES = (ciphertext, key) => {
//     console.log(CryptoJS)
//     const keyHex = CryptoJS.enc.Utf8.parse(key)
//     // direct decrypt ciphertext
//     const decrypted = CryptoJS.DES.decrypt({
//         ciphertext: CryptoJS.enc.Hex.parse(ciphertext)
//     }, keyHex, {
//         mode: CryptoJS.mode.ECB,
//         padding: CryptoJS.pad.Pkcs7
//     })
//     return decrypted.toString(CryptoJS.enc.Utf8)
// }
export const encryptByDES = (data: string): string => {
    // const Key = '123456789';
    // const tmpDES = DES.encrypt(data, Key, {
    //     mode: mode.ECB,
    //     padding: pad.Pkcs7
    // });
    // return tmpDES.toString();
    const key = "123456789";
    const keyHex = CryptoJS.enc.Utf8.parse(key)
    const encrypted = CryptoJS.DES.encrypt(data, keyHex, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    })
    return encrypted.ciphertext.toString()
}
export const decryptByDES = (data: string): string => {
    const key = "123456789";
    const keyHex = CryptoJS.enc.Utf8.parse(key)
    // {
    //     ciphertext: enc.Hex.parse(ciphertext)
    // }
    const decrypted = CryptoJS.DES.decrypt(data, keyHex, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    })
    return decrypted.toString(CryptoJS.enc.Utf8)
}
/** 密码加密解密示例
 * example
 */

// const _key = 'abcdefghijklmn'
// const _password = '123456'
// 加密
// console.log(this.encryptByDES(_password, _key))
// 解密
// console.log(this.decryptByDES(_password, _key))


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

