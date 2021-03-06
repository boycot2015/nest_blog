import { getDataFromServer } from '../index'
import url from './url'
export default {
    get (configObj) {
        let {
            method = 'get',
            params = {}
        } = configObj || {}
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
    }
}