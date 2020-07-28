import day from 'dayjs'

/**
 * 处理评论递归数量
 */
export const getCommentNum = (val) => {
    let num = 0
    val.map(el => {
        num += 1
        if (el.children && el.children.length) {
            num += getCommentNum(el.children)
        }
    })
    return num
}
/** js获取富文本中的第一张图片url正则公式
 * @param {Object} str
 */
export const getImgUrl = (str) => {
    let data = require('../assets/img/pic-error.jpg')
    str.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/, function (match, capture) {
        data = capture
    })
    return data
}
/**
 * 格式化时间戳（秒|毫秒）
 * @param {timestamp} value 时间戳
 * @param {timestamp} fstr 格式， 默认YYYY-MM-DD HH:mm:ss
 */
export const timeFormat = (value, fstr = 'YYYY-MM-DD HH:mm:ss') => {
    value = value.toString()
    if (value) {
        if (value.length === 13) {
            return day(Number(value)).format(fstr)
        }
        return day.unix(Number(value)).format(fstr)
    } else {
        return '-'
    }
}
