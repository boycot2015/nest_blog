const prefix = '/setting'
export default {
    get: prefix + '/login', // 用户登录
    get: prefix + '/get', // 获取用户
    getById: prefix + '/get/byId', // 根据id获取用户详情
    add: prefix + '/add', // 新增用户
    edit: prefix + '/edit', // 编辑用户
    status: prefix + '/status', // 更改用户状态
}