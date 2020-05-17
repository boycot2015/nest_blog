const os = require('os');

// get brower
export function GetCurrentBrowser () {
    let ua = navigator.userAgent.toLocaleLowerCase()
    let browserType = null
    if (ua.match(/msie/) != null || ua.match(/trident/) != null) {
        browserType = 'IE ' + getIeVersion()
    } else if (ua.match(/firefox/) != null) {
        browserType = 'firefox ' + ua.match(/firefox\/([\d.]+)/)[1]
    } else if (ua.match(/ucbrowser/) != null) {
        browserType = 'UC ' + ua.match(/ubrowser\/([\d.]+)/)[1]
    } else if (ua.match(/opera/) != null || ua.match(/opr/) != null) {
        browserType = 'Opera ' + getOperaVersion(ua)
    } else if (ua.match(/bidubrowser/) != null) {
        browserType = 'Baidu ' + ua.match(/bidubrowser\/([\d.]+)/)[1]
    } else if (ua.match(/metasr/) != null) {
        browserType = 'Sougou ' + ua.match(/metasr\/([\d.]+)/)[1]
    } else if (ua.match(/tencenttraveler/) != null || ua.match(/qqbrowse/) != null) {
        browserType = 'QQ ' + ua.match(/tencenttraveler\/([\d.]+)/)[1]
    } else if (ua.match(/maxthon/) != null) {
        browserType = 'Maxthon '
    } else if (ua.match(/chrome/) != null) {
        var is360 = _mime('type', 'application/vnd.chromium.remoting-viewer')
        if (is360) {
            browserType = '360 ' + ua.match(/chrome\/([\d.]+)/)[1]
        } else {
            browserType = 'Chrome ' + ua.match(/chrome\/([\d.]+)/)[1]
        }
    } else if (ua.match(/safari/) != null) {
        browserType = 'Safari ' + ua.match(/version\/([\d.]+)/)[1]
    } else {
        browserType = 'Others ' + ua.match(/version\/([\d.]+)/)[1]
    }
    return browserType
}

// 获得网络接口列表
export function getNetworkIp () {
    let needHost = ''; // 打开的host
    try {
        let network = os.networkInterfaces();
        console.log(network, 'networknetworknetworknetwork')
        for (let dev in network) {
            let iface = network[dev];
            for (let i = 0; i < iface.length; i++) {
                let alias = iface[i];
                if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                    needHost = alias.address;
                }
            }
        }
    } catch (e) {
        needHost = 'localhost';
    }
    return needHost;
}

/*
 * 获取IE浏览器版本
 */
function getIeVersion () {
    let IEMode = document.documentMode
    let rMsie = /(msie\s|trident.*rv:)([\w.]+)/;
    let ma = window.navigator.userAgent.toLowerCase()
    let match = rMsie.exec(ma);
    try {
        return match[2];
    } catch (e) {
        return IEMode;
    }
}
/*
 * 获取oper浏览器版本
 */
function getOperaVersion (userAgent) {
    try {
        if (window.opera) {
            return userAgent.match(/opera.([\d.]+)/)[1];
        } else if (userAgent.indexOf("opr") > 0) {
            return userAgent.match(/opr\/([\d.]+)/)[1];
        }
    } catch (e) {
        return 0;
    }
}

function _mime (option, value) {
    var mimeTypes = navigator.mimeTypes
    for (var mt in mimeTypes) {
        if (mimeTypes[mt][option] === value) {
            return true
        }
    }
    return false
}

// get os
export function GetOs () {
    let sUserAgent = navigator.userAgent.toLocaleLowerCase()
    let isWin = String(sUserAgent).indexOf('windows') > -1 || (navigator.platform === 'windows')
    let isMac = (navigator.platform === 'mac68k') || (navigator.platform === 'macppc') || (navigator.platform === 'macintosh') || (navigator.platform === 'macintel')
    if (isMac) return 'Mac'
    var isUnix = (navigator.platform === 'x11') && !isWin && !isMac
    if (isUnix) return 'Unix'
    var isLinux = (String(navigator.platform).indexOf('linux') > -1)
    if (isLinux) return 'Linux'
    if (isWin) {
        var isWin2K = sUserAgent.indexOf('windows nt 5.0') > -1 || sUserAgent.indexOf('windows 2000') > -1
        if (isWin2K) return 'Win2000'
        var isWinXP = sUserAgent.indexOf('windows nt 5.1') > -1 || sUserAgent.indexOf('windows xp') > -1
        if (isWinXP) return 'WinXP'
        var isWin2003 = sUserAgent.indexOf('windows nt 5.2') > -1 || sUserAgent.indexOf('windows 2003') > -1
        if (isWin2003) return 'Win2003'
        var isWinVista = sUserAgent.indexOf('windows nt 6.0') > -1 || sUserAgent.indexOf('windows vista') > -1
        if (isWinVista) return 'WinVista'
        var isWin7 = sUserAgent.indexOf('windows nt 6.1') > -1 || sUserAgent.indexOf('windows 7') > -1
        if (isWin7) return 'Win7'
        var isWin10 = sUserAgent.indexOf('windows nt 10.0') > -1 || sUserAgent.indexOf('windows 10') > -1
        if (isWin10) return 'Windows 10'
    }
    if (sUserAgent.indexOf('android') > -1) return 'Android'
    if (sUserAgent.indexOf('iphone') > -1) return 'iPhone'
    if (sUserAgent.indexOf('symbianos') > -1) return 'SymbianOS'
    if (sUserAgent.indexOf('windows phone') > -1) return 'Windows Phone'
    if (sUserAgent.indexOf('ipad') > -1) return 'iPad'
    if (sUserAgent.indexOf('ipod') > -1) return 'iPod'
    return 'others'
}