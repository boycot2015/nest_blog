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
    delete (data) {
        return axios({
            method: 'post',
            url: url.delete,
            params: data
        })
    },
    getById (params) {
        return axios.get(url.getById, { params })
    },
    status (data) {
        return axios.post(url.status, data)
    }
}
