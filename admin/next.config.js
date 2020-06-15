const WithLess = require('@zeit/next-less');
const WithCss = require('@zeit/next-css');
const WithSass = require('@zeit/next-sass');
// const withPlugins = require('next-compose-plugins');
//顶部引入
const AntDesignThemePlugin = require('antd-theme-webpack-plugin');
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');
const path = require('path')
// fix: prevents error when .less files are required by node
if (typeof require !== 'undefined') {
    require.extensions['.less'] = file => { };
}
if (typeof require !== 'undefined') {
    require.extensions['.css'] = file => { }
}
// 配置说明
const nextConfig = {
    // 编译文件的输出目录
    distDir: 'build',
    // 是否给每个路由生成Etag
    // Etag是用来做缓存验证的，如果路由执行的时候，新的Etag是相同的，那么就会复用当前内容，而无需重新渲染
    // 默认情况下，nextJS是会对每个路由生成Etag的。但是如果我们部署的时候，ngx已经做了Etag的配置，那么就可以关闭nextJS的Etag，节省性能
    generateEtags: true,
    // （不常用）页面内容缓存配置，只针对开发环境
    onDemandEntries: {
        // 内容在内存中缓存的时长（ms）
        maxInactiveAge: 25 * 1000,
        // 同时缓存多少个页面
        pagesBufferLength: 2,
    },
    // 在pages目录下那种后缀的文件会被认为是页面
    pageExtensions: ['jsx', 'js'],
    // （不常用）配置buildId，一般用于同一个项目部署多个节点的时候用到
    generateBuildId: async () => {
        if (process.env.YOUR_BUILD_ID) {
            return process.env.YOUR_BUILD_ID
        }

        // 返回null，使用nextJS默认的unique id
        return null
    },
    // （重要配置）手动修改webpack config
    webpack (config, { isServer }) {
        if (isServer) {
            const antStyles = /antd\/.*?\/style.*?/;
            const origExternals = [...config.externals];
            config.externals = [
                (context, request, callback) => {
                    if (request.match(antStyles)) return callback();
                    if (typeof origExternals[0] === 'function') {
                        origExternals[0](context, request, callback)
                    } else {
                        callback()
                    }
                },
                ...(typeof origExternals[0] === 'function' ? [] : origExternals),
            ];

            config.module.rules.push({
                test: antStyles,
                use: 'null-loader'
            })
        }
        config.plugins.push(
            new FilterWarningsPlugin({
                // ignore ANTD chunk styles [mini-css-extract-plugin] warning
                exclude: /mini-css-extract-plugin[^]*Conflicting order between:/,
            })
        )
        config.plugins.push(
            new AntDesignThemePlugin({
                antDir: path.join(__dirname, './node_modules/antd'),//antd包位置
                stylesDir: path.join(__dirname, './static/less/theme'),//指定皮肤文件夹
                varFile: path.join(__dirname, './static/less/theme/variables.less'),//自己设置默认的主题色
                indexFileName: './pages/_document.js',
                mainLessFile: path.join(__dirname, './static/less/theme/index.less'),
                outputFilePath: path.join(__dirname, './static/css/color.less'),//输出到什么地方
                themeVariables: [//这里写要改变的主题变量
                    '@primary-color',
                    '@btn-primary-bg',
                    '@text-color',
                    '@secondary-color',
                    '@text-color-secondary',
                    '@heading-color',
                    '@layout-body-background',
                    '@layout-header-background'
                ],
                generateOnce: false
            })
        )
        return config
    },
    // （重要配置）修改webpackDevMiddleware配置
    webpackDevMiddleware: config => {
        return config
    },
    // （重要配置）可以在页面上通过 procsess.env.customKey 获取 value。跟webpack.DefinePlugin实现的一致
    env: {
        customKey: 'value',
    },
    // 下面两个要通过 'next/config' 来读取
    // 只有在服务端渲染时才会获取的配置
    serverRuntimeConfig: {
        mySecret: 'secret',
        secondSecret: process.env.SECOND_SECRET,
    },
    // 在服务端渲染和客户端渲染都可获取的配置
    publicRuntimeConfig: {
        staticFolder: '/static',
    },
    // 上面这两个配置在组件里使用方式如下：
    // import getCofnig from 'next/config'
    // const { serverRuntimeConfig,publicRuntimeConfig } = getCofnig()
    // console.log(serverRuntimeConfig, publicRuntimeConfig)
    router: {
        middleware: 'headers'
    }
}
module.exports = WithLess(
    WithSass(
        WithCss({
            lessLoaderOptions: {
                modifyVars: {
                    'primary-color': '#ff9900'
                },
                javascriptEnabled: true
            },
            ...nextConfig
        })
    )
)
