// 设置axios的全局变量
import axios from '~/api/axios'
// let whiteRoute = ['/product/search', '/cart', '/product/productDetails', '/', '/login', '/product/classification', '/homeProduct', '/homeProduct/customPages', '/register', '/test']
export default async function ({ app, redirect, route, req, res, store }) {
    // let token = app.$cookies.get('token')
    // if (!app.$cookies.get('userinfo')) {
    //     app.$cookies.remove('userinfo')
    // }
    // let visitors = true
    // if (req && axios.defaults) { // 设置域名访问
    //     axios.defaults.headers.origin = req.host || 'pc.f.test.limofang.cn'
    // }
    // if (token && req && axios.defaults) { // 设置axios的全局token
    //     axios.defaults.headers.Authorization = token
    //     axios.defaults.headers.Refresh = token.split('.')[2]
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
    if (!store.state.websiteConfig) {
        // let data = await app.$api.setting.get()
        let [settingRes, homeRes] = await Promise.all([app.$api.setting.get(), app.$api.home.datas()])
        store.commit('setCommonData', [settingRes, homeRes])
    }
    if (!store.state.asideConfig) {
        let [tagRes, categoryRes] = await Promise.all([app.$api.tag.get(), app.$api.category.get()])
        store.commit('setAsideData', [tagRes, categoryRes])
    }
}