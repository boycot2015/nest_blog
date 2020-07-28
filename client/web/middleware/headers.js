// 设置axios的全局变量
import axios from '~/api/axios'
import config from '@/config'
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
        let [weatherRes, weathersRes] = await Promise.all([
            app.$axios.get('/yiketianqi', {
                params: {
                    version: 'v61',
                    ...config.weatherConfig
                }
            }), app.$axios.get('/yiketianqi', {
                params: {
                    version: 'v9',
                    ...config.weatherConfig
                }
            })])
        store.commit('setWeather', [weatherRes.data, weathersRes.data])
    }
}
