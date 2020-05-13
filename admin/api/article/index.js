import { getDataFromServer } from '../index'
import url from './url'
export default {
    getById (configObj) {
        let {
            method = 'get',
            params = {}
        } = configObj
        return getDataFromServer(url.getById, { method, params })
    },
    get (configObj) {
        let {
            method = 'get',
            params = {}
        } = (configObj && configObj) || {}
        return getDataFromServer(url.get, { method, params })
    },
    add (configObj) {
        let {
            method = 'post',
            data = {}
        } = configObj
        return getDataFromServer(url.add, { method, data })
    },
    edit (configObj) {
        let {
            method = 'post',
            data = {}
        } = configObj
        return getDataFromServer(url.edit, { method, data })
    },
    delete (configObj) {
        let {
            method = 'post',
            params = {}
        } = configObj
        return getDataFromServer(url.delete, { method, params })
    },
    status (configObj) {
        let {
            method = 'post',
            data = {}
        } = configObj
        return getDataFromServer(url.status, { method, data })
    }
}