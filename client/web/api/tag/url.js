const prefix = '/tag'
export default {
    get: prefix + '/get', // 获取标签
    getById: prefix + '/getById', // 根据id获取标签详情
    add: prefix + '/add', // 新增标签
    edit: prefix + '/edit', // 编辑标签
    delete: prefix + '/delete', // 编辑标签
    status: prefix + '/status' // 更改标签状态
}
