const prefix = '/setting'
export default {
    login: prefix + '/login', // 用户登录
    get: prefix + '/get', // 获取用户
    getById: prefix + '/get/byId', // 根据id获取用户详情
    add: prefix + '/add', // 新增用户
    edit: prefix + '/edit', // 编辑用户
    status: prefix + '/status', // 更改用户状态
    weather: '/getWeather', // 获取天气接口api
    getIp: '/getIp', // 获取ip接口api
    yiketianqi: '/yiketianqi' // 天气api
}
