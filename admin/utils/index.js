import day from 'dayjs'
import CryptoJS from 'crypto-js'
import {
    message
} from 'antd';
import uploader from '@/api/file';
import { CarryOutOutlined } from '@ant-design/icons';

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
/**
 * 复制文本到剪切板
 * @param {*} val 需要复制的文本
 * @param {*} e event事件
 */
export const copyCode = (val, e) => {
    let input = document.createElement('input');
    input.setAttribute('readonly', 'readonly');//可设可不设
    input.setAttribute('value', val);
    //input.style.display='none'; 此处设置会影响复制功能，不能使用 
    input.className = 'fixed-class';//解决滚动条滚动的情况
    document.body.appendChild(input);
    input.focus();//选中前必须要focus
    input.setSelectionRange(0, val.length);//选中的取值范围（全选）
    //或者 input.setSelectionRange(0, -1); 全选
    if (document.execCommand('copy')) {//判断是否存在该api；true为存在，false为不存在
        document.execCommand('copy');//复制成功
        console.log('复制成功');
    }
    document.body.removeChild(input);
}

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
            // console.log(data[i], data[i].parentId, parentId, 'categoryOptions');
            let obj = data[i]
            obj.title = obj.value
            obj.parentIds = [obj.parentId]
            obj.key = obj.id
            obj.icon = <CarryOutOutlined />
            temp = filterTreeData(data, data[i].id)
            if (temp.length > 0) {
                obj.children = temp
            }
            tree.push(obj)
        }
    }
    return tree
}