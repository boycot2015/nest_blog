import {
    baseUrl // 引入baseUrl
} from './baseUrl'
import axios from 'axios'
import Cookie from 'js-cookie'
import qs from 'qs'
// 创建 axios 实例
let service = axios.create({
    baseURL: baseUrl, // 请求前缀
    timeout: 20000 // 请求超时时间
    // crossDomain: true,//设置cross跨域
    // withCredentials: true//设置cross跨域 并设置访问权限 允许跨域携带cookie信息
})

// 设置 post 默认 Content-Type
service.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'

// 添加请求拦截器
service.interceptors.request.use(

    (config) => {
        // 设置token
        const token = Cookie.get('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        // 下面的代码是如何在拦截器中调用vuex管理状态。
        // 我这里主要是做了一个蒙层的遮盖
        // vuex.$store.commit('OPEN_LOADING');

        // 判断请求方式是否为POST，进行转换格式
        if (!config.url.includes('upload')) {
            // console.log(config.data, 'config.data')
            config.method === 'post'
                ? config.data = qs.stringify({ ...config.data })
                : config.params = { ...config.params }
            // 请求发送前进行处理
        }
        return config
    },
    (error) => {
        // 请求错误处理
        return Promise.reject(error)
    }
)

// 添加响应拦截器
service.interceptors.response.use(
    (response) => {
        let { data } = response
        if (response.code === 403) {
            // message.error(info.message)
        }
        return data
    },
    (error) => {
        let info = {}
        let { data } = (error && error.response) || {}
        if (error && !error.response) {
            info = {
                code: 5000,
                msg: 'Network Error'
            }
        } else {
            // 此处整理错误信息格式
            info = data
            if (info.code === 403) {
                Cookie.remove('token')
                if (process.browser) {
                    // message.error('用户信息认证失败，请重新登录！')
                    // Router.push('/login')
                    return info
                }
            }
            if (info.code === 401) {
                if (process.browser) {
                    info.message = '访客模式暂无操作权限！'
                    const userinfo = JSON.parse(JSON.parse(localStorage.getItem('userinfo')))
                    if (userinfo && userinfo.administrator) {
                        info.message = '用户信息认证失败，请重新登录！'
                        localStorage.removeItem('userinfo')
                        // Router.push({
                        //     pathname: '/login',
                        //     query: { ...Router.query, redirect: Router.pathname }
                        // })
                    }
                }
                return info
            } else {
                // message.error(data.message)
            }
        }
        // return info
    }
)

/**
 * 向外抛出service
 */
export default service
