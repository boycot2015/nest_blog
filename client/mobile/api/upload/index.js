import axios from '../axios'
import urls from './url'
const headers = {
    'content-type': 'multipart/form-data;charset=utf-8'
}
export default {
    upload (data) {
        axios.post(urls.upload, data, headers)
    }
}