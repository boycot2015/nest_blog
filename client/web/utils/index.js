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
    let data = 'https://img11.360buyimg.com/n7/jfs/t1/94448/29/2734/524808/5dd4cc16E990dfb6b/59c256f85a8c3757.jpg'
    str.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/, function (match, capture) {
        data = capture
    })
    return data
}
