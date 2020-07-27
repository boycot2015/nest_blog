const path = require('path')
const merge = require('webpack-merge')
const isDev = process.env.NODE_ENV
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
        titleTemplate: '博客系统 - %s',
        meta: [
            { charset: 'utf-8' },
            { name: 'referrer', content: 'no-referrer' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
        ],
        link: [
            { rel: 'stylesheet', href: 'https://cdn.bootcss.com/Swiper/3.4.2/css/swiper.min.css' },
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
        ],
        script: [
            // { src: 'https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js' },
            { src: 'https://cdn.bootcss.com/Swiper/3.4.2/js/swiper.min.js' }
        ]
    },
    router: { // 中间件允许您定义一个自定义函数运行在一个页面或一组页面渲染之前。
        // base: './',
        scrollBehavior (to, from, savedPosition) {
            return { x: 0, y: 0 }
        },
        routeNameSplitter: '/',
        middleware: 'headers',
        linkActiveClass: 'active'
    },
    loading: {
        color: '#00a2ff',
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
        // { src: 'swiper/swiper-bundle.css' },
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
        '@/plugins/filters',
        {
            src: '@/plugins/directives',
            ssr: true
        },
        {
            src: '@/plugins/axios-api',
            ssr: true
        },
        {
            src: '@/plugins/components',
            ssr: false
        }
        // {
        //     src: '@/plugins/vue2editor',
        //     ssr: false
        // }
        // {
        //     src: '~/plugins/vue-swiper.js',
        //     mode: 'client',
        //     ssr: false
        // }
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
        '@nuxtjs/axios',
        '@nuxtjs/proxy'
    ],
    /*
    ** Build configuration
    ** See https://nuxtjs.org/api/configuration-build/
    */
    build: {
        /*
        ** You can extend webpack config here
        */
        // publicPath: '', // 打包的默认路径为 ‘_nuxt’ 或者可以指定cdn 域名
        extend (config, ctx) {
            // Run ESLint on save
            if (ctx.isDev && ctx.isClient) {
                config.module.rules.push({
                    enforce: 'pre',
                    test: /\.(js|vue)$/,
                    loader: 'eslint-loader',
                    exclude: /(node_modules)/
                })
            }
        }
        // extractCSS: { allChunks: true }, // css 独立打包 link 的形式加载
        // filenames: { // css 和 js img 打包时指定文件夹
        //     app: ({ isDev }) => isDev ? '[name].js' : '[chunkhash].js',
        //     chunk: ({ isDev }) => isDev ? '[name].js' : '[chunkhash].js',
        //     css: ({ isDev }) => isDev ? '[name].js' : '[contenthash].css',
        //     img: ({ isDev }) => isDev ? '[path][name].[ext]' : '[hash:7].[ext]'
        // }
    },
    /*
     ** You can extend webpack config here
     */
    extend (config, ctx) {
        // console.log('extend', config, ctx)
        // config.resolve = merge(config.resolve, {
        //     alias: {
        //         components: path.resolve(__dirname, 'components'),
        //         assets: path.resolve(__dirname, 'assets'),
        //         pages: path.resolve(__dirname, 'pages'),
        //         http: path.resolve(__dirname, 'http'),
        //         utils: path.resolve(__dirname, 'utils'),
        //         store: path.resolve(__dirname, 'store')
        //     }
        // })
    },
    server: {
        port: 8080,
        host: '127.0.0.1'
        // host: 'pc.f.test.limofang.cn'
        // host: 'jianhua.f.test.limofang.cn'
    },
    axios: {
        retry: { retries: 3 },
        // 开发模式下开启debug
        // debug: process.env._ENV !== 'production',
        // 设置不同环境的请求地址
        // baseURL:
        //     process.env._ENV === 'production'
        //         ? 'http://www.blog.api.boycot.top'
        //         : 'http://localhost:4000/api',
        withCredentials: true
    },
    proxy: { // axios跨域处理
        '/getIp': { // 此处并非和url一致
            target: 'http://api.ipify.org',
            changeOrigin: true, // 允许跨域
            pathRewrite: {
                '^/getIp': ''
            }
        },
        '/getWeather': { // 此处并非和url一致
            target: 'http://api.k780.com',
            changeOrigin: true, // 允许跨域
            pathRewrite: {
                '^/getWeather': ''
            }
        }
    }
}
