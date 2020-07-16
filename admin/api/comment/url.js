const prefix = '/comment'
export default {
    get: prefix + '/get', // 获取评论
    getById: prefix + '/get/ById', // 根据id获取评论详情
    add: prefix + '/add', // 新增评论
    edit: prefix + '/edit', // 编辑评论
    delete: prefix + '/delete', // 删除评论
    batchDelete: prefix + '/delete/batch', // 批量删除评论
    batchStatus: prefix + '/status/batch', // 批量更改评论状态
}