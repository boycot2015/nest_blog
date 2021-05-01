import Vuex from 'vuex'
import Vue from 'vue'
import Cookie from 'js-cookie'
import { Base64 } from 'js-base64'
Vue.use(Vuex)
const state = {
    login: false,
    token: '',
    userInfo: uni.getStorage({ key: 'userinfo' }) && uni.getStorage({ key: 'userinfo' }) || {}
}
const mutations = {
    login (state, provider) {
        return new Promise((resolve, reject) => {
            if (provider) {
                state.login = true
                state.token = provider
                Cookie.set('token', provider)
                provider = JSON.parse(Base64.decode(provider.split('.')[1]))
                uni.setStorage({
                    key: 'userinfo',
                    data: JSON.stringify(provider)
                })
                state.userInfo = provider
                console.log(provider)
                resolve(provider)

            } else {
                reject()
            }
        })
    },
    logout (state) {
        state.login = false
        state.token = ''
        state.userInfo = {}
        Cookie.remove('token')
        uni.removeStorage({ key: 'userinfo' })
    }
}
export default new Vuex.Store({
    state,
    mutations
})