import axios from '@/api/axios'
import url from './url'
export default {
    login (configObj) {
        let {
            method = 'post',
            data = {}
        } = configObj
        return getDataFromServer(url.login, { method, data })
    },
    get (configObj) {
        let {
            method = 'get',
            params = {}
        } = configObj
        return getDataFromServer(url.get, { method, params })
    }
}