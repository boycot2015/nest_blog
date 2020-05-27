import day from 'dayjs'
/**
 * 格式化时间戳（秒|毫秒）
 * @param {timestamp} value 时间戳
 * @param {timestamp} fstr 格式， 默认YYYY-MM-DD HH:mm:ss
 */
const timeFilter = (value, fstr = 'YYYY-MM-DD HH:mm:ss') => {
    value = value.toString()
    if (value) {
        let strArr = ['秒前', '分钟前', '小时前', '天前', '周前', '月前']
        let now = new Date().getTime() - value
        let mins = 60 * 1000
        let hours = 60 * 60 * 1000
        let days = 60 * 60 * 24 * 1000
        let weeks = 60 * 60 * 24 * 7 * 1000
        let months = 60 * 60 * 24 * 7 * 30 * 1000
        if (now <= mins) {
            return Math.ceil(now / 1000) + strArr[0]
        } else if (now > mins && now <= hours ) {
            return Math.floor(now / mins) + strArr[1]
        } else if (now > hours && now <= days) {
            return Math.floor(now / hours) + strArr[2]
        } else if (now > days && now <= weeks) {
            return Math.floor(now / days) + strArr[3]
        }  else if (now > weeks && now <= months) {
            return Math.floor(now / weeks) + strArr[4]
        }  else if (now > months) {
            return Math.floor(now / months) + strArr[5]
        } else {
            if (value.length === 13) {
                return day(Number(value)).format(fstr)
            }
            return day.unix(Number(value)).format(fstr)
        }
    } else {
        return '-'
    }
}

/**
 * 手机号格式化
 * @param {String} phone
 */
const formatPhone = (phone) => {
    phone = phone.toString()
    return phone.substr(0, 3) + '****' + phone.substr(7, 11)
}

/*
 * 4位一空格（格式化银行卡）
 * @param {String} val
 */
const formatBank = (val) => {
    if (val) {
        return val.toString().replace(/\s/g, '').replace(/(.{4})/g, '$1 ')
    }
}

/**
 * 千分位格式化
 * @param {数字} val
 */
const toThousands = (val) => {
    let num = (val || 0).toString()
    let result = ''
    while (num.length > 3) {
        result = ',' + num.slice(-3) + result
        num = num.slice(0, num.length - 3)
    }
    if (num) {
        result = num + result
    }
    return result
}

/**
 * 格式化小数位
 * @param val 传入的值
 * @param pos 保留的小数位
 * @returns {*}
 */
const formatFloat = (val, pos = 2) => {
    let f = parseFloat(val)
    if (isNaN(f)) {
        return false
    }
    f = Math.round(val * Math.pow(10, pos)) / Math.pow(10, pos) // pow 幂
    let s = f.toString()
    let rs = s.indexOf('.')
    if (rs < 0) {
        rs = s.length
        s += '.'
    }
    while (s.length <= rs + pos) {
        s += '0'
    }
    return s
}

/**
 * 格式化时长
 * @param second
 * @returns {string}
 */
const realFormatSecond = (second) => {
    let secondType = typeof second

    if (secondType === 'number' || secondType === 'string') {
        second = parseInt(second)

        let hours = Math.floor(second / 3600)
        second = second - hours * 3600
        let mimute = Math.floor(second / 60)
        second = second - mimute * 60

        return hours + ':' + ('0' + mimute).slice(-2) + ':' + ('0' + second).slice(-2)
    } else {
        return '0:00:00'
    }
}

export default {
    timeFilter, // 格式化时间戳（秒|毫秒）
    formatPhone, // 手机号格式化
    formatBank, // 4位一空格（格式化银行卡）
    toThousands, // 千分位格式化
    formatFloat, // 格式化小数位
    realFormatSecond // 格式化时长
}
