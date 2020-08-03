const prefix = '/article'
export default {
    get: prefix, // 获取文章列表
    getById: prefix + '/getById', // 根据id获取文章详情
    add: prefix + '/add', // 新增文章
    edit: prefix + '/edit', // 编辑文章
    delete: prefix + '/delete', // 删除文章
    status: prefix + '/status', // 更改文章状态
    batchDelete: prefix + '/delete/batch', // 批量删除文章
    batchStatus: prefix + '/status/batch' // 批量更改文章状态
}