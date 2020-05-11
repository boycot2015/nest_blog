import baseUrl from '../baseUrl';
const prefix = baseUrl + '/user'
export default {
    get: prefix + '/get',
    getById: prefix + '/get/ById',
}