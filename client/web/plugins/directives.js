import Vue from 'vue'
Vue.use((Vue) => {
    ((requireContext) => {
        const arr = requireContext.keys().map(requireContext);
        (arr || []).forEach((directive) => {
            directive = directive.__esModule && directive.default ? directive.default : directive
            Object.keys(directive).forEach((key) => {
                Vue.directive(key, directive[key])
            })
        })
    })(require.context('../directives', false, /^\.\/.*\.js$/))
})
