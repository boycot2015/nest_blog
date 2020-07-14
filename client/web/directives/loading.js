let loadingBox = ''
export default {
    loading: {
        // 初始化指令
        bind (el, binding, vnode) {
            if (binding.value) {
                loadingBox = document.createElement('div')
                loadingBox.className = 'loading-box'
                el.appendChild(loadingBox)
                !el.style.position && (el.style.position = 'relative')
                let loadingText = document.createElement('span')
                loadingBox.className = 'loading-more-text'
                loadingText.innerHTML = '加载中...'
                loadingBox.appendChild(loadingText)
            } else if (loadingBox) {
                el.removeChild(loadingBox)
            }
        },
        inserted (el, binding, vnode) {
        },
        update (el, binding, vnode) {
            // console.log(binding.value, 'loading')
            if (!binding.value) {
                el.removeChild(loadingBox)
            }
        },
        unbind (el, binding) {
            if (!binding.value && loadingBox) {
                el.removeChild(loadingBox)
            }
        }
    }
}
