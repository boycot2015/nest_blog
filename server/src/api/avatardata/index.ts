import { httpUtil } from '../../utils/httpUtil'
import urls from './url'
const util = require('util');
const hostname = 'api.avatardata.cn'
const keys = {
    newsListKey: '27f22af449a1487bba835e062d08c967',
    queryKey: '007077bae3d2499ab5ad7b66ffaf818b'
}
export default {
    getNewsList (params) {
        urls.newsList = util.format(
            urls.newsList,
            keys.newsListKey,
            params.top || 'top'
        )
        return httpUtil.get({
            hostname,
            path : urls.newsList
        })
    },
    queryNews (params) {
        urls.queryNews = util.format(
            urls.queryNews,
            keys.queryKey,
            params.keyword || ''
        )
        return httpUtil.get({
            hostname,
            path : urls.queryNews
        })
    },
    hotKeyWord () {
        urls.hotKeyWord = util.format(
            urls.hotKeyWord,
            keys.queryKey
        )
        return httpUtil.get({
            hostname,
            path : urls.hotKeyWord
        })
    }
}