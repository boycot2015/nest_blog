// toutiaoUrl: '/toutiao/index?key=%s&type=top',
// queryUrl: '/ActNews/Query?key=%s&keyword=%s&encode=utf8',
// hotWordUrl: '/ActNews/LookUp?key=%s',
// key: '007077bae3d2499ab5ad7b66ffaf818b',
// hostname : 'api.avatardata.cn',
// juheHostName: 'http://v.juhe.cn/calendar/day',
const keys = {
    calendarKey: '0e273278eaf94cd5548e554e1206c2e1',
    weatherKey: '107072b8b8d9a72b1fceea6db32a9fd6',
    ipKey: '0f9cea305abd473f438ff4a9c105b359',
    toutiaoKey: '2c8eaecae892765c9853b628ea86d311'
}
import { httpUtil } from '../../utils/httpUtil'
import urls from './url'
const util = require('util');
const hostname = 'v.juhe.cn'
export default {
    getNewsList (params) {
        urls.newsList = util.format(
            urls.newsList,
            keys.toutiaoKey,
            params.top || 'top'
        )
        return httpUtil.get({
            hostname,
            path : urls.newsList
        })
    },
    queryCalendar (params) {
        urls.queryCalendar = util.format(
            urls.queryCalendar,
            keys.calendarKey,
            params.date || ''
        )
        return httpUtil.get({
            hostname,
            path : urls.queryCalendar
        })
    },
    queryIp (params) {
        urls.queryIp = util.format(
            urls.queryIp,
            keys.ipKey,
            params.ip || ''
        )
        return httpUtil.get({
            hostname,
            path : urls.queryIp
        })
    },
    hotKeyWord () {
        urls.hotKeyWord = util.format(
            urls.hotKeyWord,
            keys.toutiaoKey
        )
        return httpUtil.get({
            hostname,
            path : urls.hotKeyWord
        })
    }
}