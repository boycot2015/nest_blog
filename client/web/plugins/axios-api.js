import Vue from 'vue'
import api from '@/api/install'
import apiList from '@/api/apiList'
Vue.use(api)

// 这里是 为了在 asyncData 方法中使用
export default ({ app, req, res }, inject) => {
    // Set the function directly on the context.app object
    app.$api = apiList // 名称
}
