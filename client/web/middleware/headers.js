// 设置axios的全局变量
import axios from '~/api/axios'
// let whiteRoute = ['/product/search', '/cart', '/product/productDetails', '/', '/login', '/product/classification', '/homeProduct', '/homeProduct/customPages', '/register', '/test']
export default async function ({ app, redirect, route, req, res, store }) {
    // let token = app.$cookies.get('token')
    // if (!app.$cookies.get('userinfo')) {
    //     app.$cookies.remove('userinfo')
    // }
    // if (token && req && axios.defaults) { // 设置axios的全局token
    //     axios.defaults.headers.Authorization = token
    //     axios.defaults.headers.Refresh = token.split('.')[2]
    // }
    // let visitors = true
    // if (req && axios.defaults) { // 设置域名访问
    //     axios.defaults.headers.origin = req.host || 'pc.f.test.limofang.cn'
    // }
    // 处理需要登录的页面
    // if (store.state.visitors === '') { // 获取网站信息
    //     let data = await app.$api.user.getDetailInfoBooleans()
    //     if (data && data.success) {
    //         visitors = data.result.visitors
    //     } else {
    //         visitors = true
    //         data = {
    //             result: {}
    //         }
    //     }
    //     store.commit('setInfoBooleans', data.result)
    // } else {
    //     visitors = store.state.DetailInfoBooleans.visitors
    // }
    // 获取用户信息
    // if (token && store.state.authUser === null) {
    //     let jhhw = await app.$api.user.userPageInfo()
    //     if (jhhw && jhhw.success) {
    //         store.commit('SET_USER', jhhw.result)
    //     } else {
    //         store.commit('SET_USER', {})
    //     }
    // }
    // if ((!token && !whiteRoute.includes(route.path)) || (!visitors && !token)) {
    //     // console.log(route, 'route')
    //     route.path !== '/login' && redirect('/login?cz=' + route.path)
    // }

    // 获取网站信息
    if (!store.state.websiteConfig) {
        // let data = await app.$api.setting.get()
        let user = store.state.authUser
        user = user !== null ? user : {}
        let [settingRes, homeRes] = await Promise.all([app.$api.setting.get({ websiteId: user.websiteId }), app.$api.home.datas()])
        store.commit('setCommonData', [settingRes, homeRes])
    }
    if (!store.state.asideConfig) {
        let [tagRes, categoryRes] = await Promise.all([app.$api.tag.get(), app.$api.category.get()])
        store.commit('setAsideData', [tagRes, categoryRes])
    }
    // 获取天气数据
    if (!store.state.weather) {
        let res = await app.$axios.get('/getIp')
        if (res && res.data) {
            res = await app.$axios.get('/getWeather', {
                params: {
                    app: 'weather.future',
                    weaid: res.data || 1,
                    appkey: 10003,
                    sign: 'b59bc3ef6191eb9f747dd4e83c99f2a4',
                    format: 'json'
                }
            })
            res = res && res.data
            if (res && res.success === '1') {
                store.commit('setWeather', res)
            }
        }
    }
}
