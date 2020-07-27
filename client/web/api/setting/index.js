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
        return axios.get(url.weather, { params })
    },
    getIpByIpify () {
        return axios.get(url.getIp, {
            params: {
                format: 'json'
            }
        })
    }
}
