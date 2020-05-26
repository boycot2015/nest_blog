import axios from '@/api/axios'
import url from './url'
export default {
    getById (params) {
        return axios.get(url.getById, {params })
    },
    get (params) {
        return axios.get(url.get, { params })
    },
    add (data) {
        return axios.post(url.add, data)
    },
    edit (data) {
        return axios.post(url.edit, data)
    },
    delete (data) {
        return axios.post(url.delete, data)
    },
    status (data) {
        return axios.post(url.status, data)
    }
}