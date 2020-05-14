import axios from './axios';
import { message } from 'antd';
import Router from 'next/router';
const key = 'keepOnlyOne';
import Cookies from 'js-cookies';
/**
 *  接口请求数据时执行的方法
 *  接受参数为请求的路径apiUrl、请求接口配置参数configObj
 *
 * @param {String} apiUrl            用户传入的请求路径
 * @param {Object} configObj        用户传入的接口参数
 */
export function getDataFromServer (apiUrl, configObj) {
    //用户传入的接口配置参数
    let {
        method = 'GET',
        params = {},
        data = {},
        timeout = 5000
    } = configObj;
    /**
     * 返回的Promise对象含有then、catch方法
     */
    return new Promise(function (resolve, reject) {
        axios({
            url: apiUrl,
            method: method,
            params: params,
            data: data
        }).then(function (response) {
            if (response) {
                // console.log(apiUrl, response, 'configObj')
                if (!response.data) {
                    message.error('返回的数据格式有误');
                }
                if (response.code === 401) {
                    if (process.browser) {
                        Cookies.removeItem('token')
                        Router.push('/login')
                    }
                }
                resolve(response);
            } else {
                //处理特殊的情况就是response返回什么也没有Unauthorized
                message.error('服务器错误');
                resolve(response);
            }
        }).catch(function (error) {
            message.error('网络异常,请稍后重试');
            reject(error);
        })
    })
}

/**
 * 导出表中选中部分数据
 * 1.exportArray、downLoadURL为必填选项
 * 2.当downLoadFileName为null时，按默认名称下载
 * 3.当_this、stateName为null时，导出完成后不清空选中，不为null时，导出完成后清空选中
 *
 * @param {Array}  exportArray          部分导入传入的数组
 * @param {String} downLoadFileName     下载的下来的文件名字
 * @param {String} downLoadURL          服务请求的地址
 * @param {String} _this                this
 * @param {String} stateName            命名的state的名字
 */

export function getStreamData (exportArray, downLoadFileName, downLoadURL, _this, stateName) {

    //如果传入的数组为空直接返回
    if (!(exportArray.length > 0)) {
        message.warn({
            message: '请先选择导出的数据',
            description: '没有选择要导出的数据无法进行导出'
        });
        return;
    }

    axios({
        method: 'post',
        url: downLoadURL,
        data: JSON.stringify(exportArray),
        headers: {
            'Content-Type': 'application/json',
            'token': window.sessionStorage.getItem('token') || ''
        },
        responseType: 'blob'
    }).then((response) => {
        if (response) {
            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' });
            //下载文件的名称
            let filename = 'excel.xlsx';
            if (downLoadFileName) {
                filename = downLoadFileName;
            }
            //非IE浏览器通过download属性进行下载
            if ('download' in document.createElement('a')) {
                let downloadElememt = document.createElement('a');
                let href = '';
                if (window.URL) {
                    href = window.URL.createObjectURL(blob);
                } else {
                    href = window.webkitURL.createObjectURL(blob);
                }
                downloadElememt.href = href;
                downloadElememt.download = filename;
                document.body.appendChild(downloadElememt);
                downloadElememt.click();
                if (window.URL) {
                    window.URL.revokeObjectURL(href);
                } else {
                    window.webkitURL.revokeObjectURL(href);
                }
                // 导出成功之后清空选中的数据
                if (_this && stateName) {
                    _this.setState({
                        [stateName]: []
                    });
                }
            } else {
                // IE浏览器,通过navigator进行下载,支持IE10+
                if (navigator.msSaveBlob) {
                    // 导出成功之后清空选中的数据
                    if (_this && stateName) {
                        _this.setState({
                            [stateName]: []
                        });
                    }
                    return navigator.msSaveBlob(blob, filename);
                }
            }
        } else {
            message.warn({
                message: '导出选中数据失败',
                description: '调用接口导出选中的数据失败'
            });
        }

    }).catch(() => {
        message.error({
            message: '操作失败',
            description: '网络异常,请稍后重试'
        });
    })
}

export class FileProvider {
    /**
     * 上传文件
     * @param file
     */
    static async uploadFile (file) {
        const formData = new FormData();
        formData.append("file", file);
        
        return axios.post("/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
    }
}
