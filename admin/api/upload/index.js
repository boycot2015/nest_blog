import axios from '@/api/axios'
import url from './url'
const headers = {
    "Content-Type": "multipart/form-data"
}
export default {
    uploadFile (data) {
        return axios.post(url.uploadFile, data, headers)
    },
    uploadFiles (data) {
        return axios.post(url.uploadFiles, data, headers)
    },
    uploadFileFields (data) {
        return axios.post(url.uploadFileFields, data, headers)
    }
}