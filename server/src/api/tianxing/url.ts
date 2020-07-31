const prefx = '/txapi'
export default {
    newsList: '/topnews/index?key=%s&word=%s&type=%s',
    queryKey: '/topnews/index?key=%s&word=%s',
    queryCalendar: prefx + '/lunar/index?key=%s&date=%s&encode=utf8',
    queryIp: prefx + '/ipquery/index?key=%s',
    weather: prefx + '/tianqi/index?key=%s&ip=%s&city=%s',
    hotKeyWord: prefx + '/nethot/index?key=%s'
}