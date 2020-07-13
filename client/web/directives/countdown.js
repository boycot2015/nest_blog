var toZeroStr = (val, num = 2) => {
    num = num || 2
    return (new Array(num)
        .join('0') + val)
        .slice(-num)
}
var milliseconds2HMS = (diff) => {
    const millisecond = diff % 1000
    diff = diff - millisecond
    return seconds2HMS(diff / 1000)
}
var seconds2HMS = (diff) => {
    const seconds = diff % 60
    const minutes = (diff - seconds) % 3600
    // const hours = (diff - minutes - seconds) % 86400;
    const hours = diff - minutes - seconds
    return [hours / 3600, minutes / 60, seconds]
}

export default {
    // 倒计时
    countdown: {
        bind (el, binding, vnode) {
            const { componentOptions, data } = vnode
            const listeners = componentOptions ? componentOptions.listeners : null
            const on = data ? data.on : null
            const events = listeners || (on || null)
            if (events && typeof events === 'object' && Object.keys(events).length) {
                binding.customListeners = events
            }
        },

        inserted (el, binding, vnode) {
            let val = +binding.value
            if (!val) {
                return
            }
            const formatter = vnode.data.attrs.formatter
            let timer = null
            window.clearInterval(el.timer)
            const tFunction = () => {
                val -= 1000
                let instance = milliseconds2HMS(val)
                if (val <= 0) {
                    if (timer) {
                        window.clearInterval(timer)
                        timer = null
                        if (binding.customListeners) {
                            binding.customListeners.complete && binding.customListeners.complete()
                        }
                    }
                    el.innerHTML = '0'
                    return
                }
                el.innerHTML = formatter.replace(/(HH.+)(mm.+)(ss.+)/g, (str, $1, $2, $3) => {
                    return str.replace(new RegExp($1, 'g'), !instance[0] ? '' : $1.replace(/HH/g, toZeroStr(instance[0])))
                        .replace(new RegExp($2, 'g'), !instance[0] && !instance[1] ? '' : $2.replace(/mm/g, toZeroStr(instance[1])))
                        .replace(new RegExp($3, 'g'), !instance[1] && !instance[2] ? '' : $3.replace(/ss/g, toZeroStr(instance[2])))
                })
            }
            tFunction()
            timer = window.setInterval(tFunction, 1000)
            el.timer = timer
        },

        update (el, binding, vnode) {
            if (binding.oldValue !== binding.value) {
                window.clearInterval(el.timer)
                binding.def.inserted(el, binding, vnode)
            }
        },

        unbind (el, binding, vnode) {
            window.clearInterval(el.timer)
            el.timer = null
            delete el.timer
            const customListeners = binding.customListeners
            if (customListeners) {
                delete binding.customListeners
            }
        }
    }
}
