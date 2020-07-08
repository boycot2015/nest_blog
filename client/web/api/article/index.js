import axios from '@/api/axios'
import url from './url'
export default {
    getById (configObj) {
        let {
            method = 'get',
            params = {}
        } = configObj
        return axios({ url: url.getById, method, params })
    },
    get (configObj) {
        let {
            method = 'get',
            params = {}
        } = (configObj && configObj) || {}
        return axios({ url: url.get, method, params })
    },
    add (configObj) {
        let {
            method = 'post',
            data = {}
        } = configObj
        return axios({ url: url.add, method, data })
    },
    edit (configObj) {
        let {
            method = 'post',
            data = {}
        } = configObj
        return axios({ url: url.edit, method, data })
    },
    delete (configObj) {
        let {
            method = 'post',
            params = {}
        } = configObj
        return axios({ url: url.delete, method, params })
    },
    status (configObj) {
        let {
            method = 'post',
            data = {}
        } = configObj
        return axios({ url: url.status, method, data })
    }
}
