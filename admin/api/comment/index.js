import axios from '@/api/axios'
import url from './url'
export default {
    get (params) {
        return axios.get(url.get, { params })
    },
    add (data) {
        return axios.post(url.add, data)
    },
    edit (data) {
        return axios.post(url.edit, data)
    },
    getById (params) {
        return axios.get(url.getById, { params })
    },
    status (data) {
        return axios.post(url.status, data)
    }
}