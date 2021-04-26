// 设置axios的全局变量
import axios from '~/api/axios'
import config from '@/config'
// let whiteRoute = ['/product/search', '/cart', '/product/productDetails', '/', '/login', '/product/classification', '/homeProduct', '/homeProduct/customPages', '/register', '/test']
export default async function ({ app, redirect, route, req, res, store }) {
    if (req && axios.defaults) { // 设置域名访问
        axios.defaults.headers.origin = req.host || 'www.boycot.top'
    }
    // let token = app.$cookies.get('token')
    // if (!app.$cookies.get('userinfo')) {
    //     app.$cookies.remove('userinfo')
    // }
    // if (token && req && axios.defaults) { // 设置axios的全局token
    //     axios.defaults.headers.Authorization = token
    //     axios.defaults.headers.Refresh = token.split('.')[2]
    // }
    // let visitors = true
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
    if (process.server) {
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
            // let ipRes = await app.$api.setting.getIpByIpify('/getIp', {
            //     params: {
            //         ie: 'utf-8'
            //         // format: 'json'
            //     },
            //     responseType: 'json'
            // })
            // ipRes = ipRes && JSON.parse(ipRes.data.split('=')[1].split(';')[0])

            // x-real-ip 通过nginx配置添加
            const ip =
                req.headers['bigo-x-client-source-ip'] ||
                req.headers['x-real-ip'] ||
                req.connection.remoteAddress

            console.log(process.env.IP, ip, 'process.env.IP, ipRes')
            // 对ip做业务处理
            // let [weatherRes, weathersRes] = await Promise.all([
            //     app.$axios.get('/yiketianqi', {
            //         params: {
            //             version: 'v61',
            //             ip: ip || process.env.IP || '',
            //             ...config.weatherConfig
            //         }
            //     }), app.$axios.get('/yiketianqi', {
            //         params: {
            //             version: 'v9',
            //             ip: ip || process.env.IP || '',
            //             ...config.weatherConfig
            //         }
            //     })])
            app.$api.setting.weather({}).then(weatherRes => {
                console.log(weatherRes, 'weatherRes')
                weatherRes && weatherRes.data && store.commit('setWeather', [weatherRes.data, {}])
            })
        }

        // 获取热点搜索词汇列表
        if (!store.state.keyWordList) {
            let keyWordRes = await app.$api.article.getkeyWord()
            if (keyWordRes && keyWordRes.success) {
                store.commit('setKeyWordList', keyWordRes.data)
            }
        }
    }
}
