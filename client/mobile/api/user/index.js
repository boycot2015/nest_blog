import axios from '../axios'
import urls from './url'
export default {
    get (params) {
        return axios.get(urls.get, { params })
    },
    getById (params) {
        return axios.get(urls.getById, { params })
    }
}