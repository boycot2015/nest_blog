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
    delete (params) {
        return axios.post({
			method: 'post',
			url: url.delete,
			params
		})
    }
}