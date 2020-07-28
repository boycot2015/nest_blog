import axios from '@/api/axios'
import url from './url'
export default {
    addConfig (data) {
        return axios.post(url.add, data)
    },
    editConfig (data) {
        return axios.post(url.edit, data)
    },
    get (params) {
        return axios.get(url.get, { params })
    },
    weather (params) {
        return axios.get(url.weather, {
            app: 'weather.future',
            weaid: params.data || 1,
            appkey: 10003,
            sign: 'b59bc3ef6191eb9f747dd4e83c99f2a4',
            ...params
        })
    },
    getIpByIpify () {
        return axios.get(url.getIp, {
            params: {
                format: 'json'
            }
        })
    },
    yiketianqi (params) {
        return axios.get(url.yiketianqi, {
            params: {
                version: 'v9',
                appid: '47499825',
                appsecret: 'liyLN9Cq',
                ...params
            }
        })
    }
}
