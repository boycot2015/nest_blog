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