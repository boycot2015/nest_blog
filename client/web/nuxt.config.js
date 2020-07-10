
export default {
    /*
    ** Nuxt rendering mode
    ** See https://nuxtjs.org/api/configuration-mode
    */
    mode: 'universal',
    /*
    ** Nuxt target
    ** See https://nuxtjs.org/api/configuration-target
    */
    target: 'server',
    /*
    ** Headers of the page
    ** See https://nuxtjs.org/api/configuration-head
    */
    head: {
        title: process.env.npm_package_name || '',
        meta: [
            { charset: 'utf-8' },
            { name: 'referrer', content: 'no-referrer' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
        ],
        link: [
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
        ]
    },
    router: { // 中间件允许您定义一个自定义函数运行在一个页面或一组页面渲染之前。
        // scrollBehavior (to, from, savedPosition) {
        //     return { x: 0, y: 0 }
        // },
        routeNameSplitter: '/',
        middleware: 'headers',
        linkActiveClass: 'active-link'
    },
    loading: {
        color: '#ff9900',
        height: '2px'
    },
    /*
    ** Global CSS
    */
    css: [
        /**
         * 配置全局 css
         */
        // './assets/less/base/variable.less',
        './assets/less/index.less'
    ],
    styleResources: {
        less: ['./assets/less/base/variable.less']
    },
    /*
    ** Plugins to load before mounting the App
    ** https://nuxtjs.org/guide/plugins
    */
    plugins: [
        {
            src: '@/plugins/axios-api',
            ssr: true
        }
    ],
    /*
    ** Auto import components
    ** See https://nuxtjs.org/api/configuration-components
    */
    components: true,
    /*
    ** Nuxt.js dev-modules
    */
    buildModules: [
        // Doc: https://github.com/nuxt-community/nuxt-tailwindcss
        '@nuxtjs/tailwindcss',
        '@nuxtjs/style-resources',
        '@nuxtjs/eslint-module'
    ],
    /*
    ** Nuxt.js modules
    */
    modules: [
    ],
    /*
    ** Build configuration
    ** See https://nuxtjs.org/api/configuration-build/
    */
    build: {
    },
    server: {
        port: 8080
        // host: '192.168.1.175'
        // host: 'pc.f.test.limofang.cn'
        // host: 'jianhua.f.test.limofang.cn'
    }
}
