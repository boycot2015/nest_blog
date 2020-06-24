import CryptoJS from 'crypto-js'
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
/**
 * 处理评论递归数量
 */
export const getCommentNum = (val) => {
	let num = 0
	val.map(el => {
		num += 1
		if(el.children && el.children.length) {
			num += getCommentNum(el.children)
		}
	})
	return num
}
/**	js获取富文本中的第一张图片url正则公式
 * @param {Object} str
 */
export const getImgUrl = (str) => {
	let data = 'https://img11.360buyimg.com/n7/jfs/t1/94448/29/2734/524808/5dd4cc16E990dfb6b/59c256f85a8c3757.jpg'
	str.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/, function (match, capture) {
		data = capture
	})
	return data
}