const prefix = '/category'
export default {
    get: prefix + '/get', // 获取分类
    getById: prefix + '/getById', // 根据id获取分类详情
    add: prefix + '/add', // 新增分类
    edit: prefix + '/edit', // 编辑分类
    delete: prefix + '/delete', // 编辑分类
    status: prefix + '/status', // 更改分类状态
}