import MessageBox from './src/index'
MessageBox.install = (Vue) => {
    // 生成一个Vue的子类
    // 同时这个子类也就是组件
    const MessageBoxConstructor = Vue.extend(MessageBox)
    // 定义一个外部的变量，用于控制调用多次提示组件时，清除延时器
    let timer = null
    // 通过Vue的原型注册一个方法
    // 让所有实例共享这个方法
    const messageBox = {
        allMessage (msg, type, duration) {
            if (timer !== null) return
            // 每次弹框生成一个该子类的实例
            const instance = new MessageBoxConstructor()
            // 将这个实例挂载在我创建的div上
            instance.$mount(document.createElement('div'))
            // 并将此div加入全局挂载点内部
            document.body.appendChild(instance.$el)
            timer = setTimeout(() => {
                instance.visible = false
                setTimeout(() => {
                    document.body.removeChild(instance.$el)
                    clearTimeout(timer)
                    timer = null
                }, 500)
            }, duration)
            timer = setTimeout(() => {
                instance.message = msg
                instance.visible = true
                instance.type = type
                instance.duration = duration
            }, 10)
        },
        warning (msg, duration = 2000) {
            this.allMessage(msg, 'error', duration)
        },
        success (msg, duration = 2000) {
            this.allMessage(msg, 'success', duration)
        },
        error (msg, duration = 2000) {
            this.allMessage(msg, 'error', duration)
        }
    }
    // 将方法挂载全局
    Vue.prototype.$message = messageBox
}
export default MessageBox
