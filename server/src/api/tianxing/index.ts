// toutiaoUrl: '/toutiao/index?key=%s&type=top',
// queryUrl: '/ActNews/Query?key=%s&keyword=%s&encode=utf8',
// hotWordUrl: '/ActNews/LookUp?key=%s',
// key: '007077bae3d2499ab5ad7b66ffaf818b',
// hostname : 'api.avatardata.cn',
// juheHostName: 'http://v.juhe.cn/calendar/day',
const apiKey = 'e8811b5a953a27e8901fd8564b42c0d1'
import { httpUtil } from '../../utils/httpUtil'
import urls from './url'
const util = require('util');
const hostname = 'api.tianapi.com'
export default {
    getNewsList (params) {
        // console.log(params.word, urls.newsList, 'urls.newsList')
        return httpUtil.get({
            hostname,
            path: encodeURI(util.format(
                urls.newsList,
                apiKey,
                params.word || '',
                'top'
            ))
        })
    },
    // queryNews (params) {
    //     urls.queryKey = util.format(
    //         urls.queryKey,
    //         apiKey,
    //         params.word || ''
    //     )
    //     urls.queryKey = encodeURI(urls.queryKey)
    //     return httpUtil.get({
    //         hostname,
    //         path: urls.queryKey
    //     })
    // },
    queryCalendar (params) {
        urls.queryCalendar = util.format(
            urls.queryCalendar,
            apiKey,
            params.date || ''
        )
        return httpUtil.get({
            hostname,
            path: urls.queryKey
        })
    },
    queryIp (params) {
        return httpUtil.get({
            hostname,
            path:  util.format(
                urls.queryIp,
                apiKey,
                params.ip || ''
            )
        })
    },
    weather (params) {
        return httpUtil.get({
            hostname,
            path: encodeURI(util.format(
                urls.weather,
                apiKey,
                params.ip,
                params.city || '深圳'
            ))
        })
    },
    hotKeyWord () {
        return httpUtil.get({
            hostname,
            path: util.format(
                urls.hotKeyWord,
                apiKey
            )
        })
    }
}