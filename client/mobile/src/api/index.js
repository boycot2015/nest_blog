import user from './user'
import tag from './tag'
import article from './article'
// 把我们所有的api接口安装到全局，之后我们在main.js文件中导入就可以了。
import apiList from './apiList'
const install = function (Vue) {
    if (install.installed) {
        return false
    };
    install.installed = true
    Object.defineProperties(Vue.prototype, {
        $api: {
            get () {
                return apiList
            },
            enumerable: false, // 不可枚举
            configurable: false // 不可重写
        }
    })
}
export default {
    install
}
