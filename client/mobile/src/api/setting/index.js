import axios from '@/api/axios'
import url from './url'
export default {
    login (data) {
        return axios.post(url.login, data)
    },
    get (params) {
        return axios.get(url.get, { params })
    }
}