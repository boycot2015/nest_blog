import App from 'next/app'
// import 'antd/dist/antd.css'
import Layout from '@/layouts';
// import axios from '@/api/axios'
import SetHeaderCookie from '@/middleware/header'
import $api from '@/api/apiList'
import routes from '@/config/router'
import { Base64 } from 'js-base64'
import { parseCookies, setCookie, destroyCookie } from 'nookies'
import { getThemeVariables } from 'antd/dist/theme'

// import * as sysTool from '@/static/js/systemTool'
import '../static/css/index.css'
// import '../static/scss/index.scss'
import '../static/less/index.less'
class AntApp extends App {
    static async getInitialProps ({ Component, ctx, router, redirect }) {
        if (Component.getInitialProps) {
            let cookies = {}
            let userinfo = { administrator: false }
            SetHeaderCookie(ctx)
            cookies = parseCookies(ctx);
            cookies.token && (userinfo = JSON.parse(Base64.decode(cookies.token.split('.')[1])))
            let pageProps = await Component.getInitialProps({ ctx, router, $api, userinfo })
            pageProps = { userinfo, $api, ...pageProps }
            return { pageProps, ...parseCookies(ctx) }
        } else return {}
    }
    state = {
        ...this.props
    }
    componentDidMount () {
        this.setThemeConfig()
    }

    setThemeConfig () { // 更换主题颜色
        let { themeColor = '{}' } = this.state
        if (themeColor !== '{}') {
            themeColor = JSON.parse(themeColor)
            let options = {
                '@primary-color': themeColor.color,
                '@btn-primary-bg': themeColor.color,
                '@border-color-base': themeColor.color,
                '@layout-body-background': themeColor.background,
                '@layout-header-background': themeColor.background,
            }
            // if (themeColor.showNight) {
            //     options = getThemeVariables({
            //         dark: themeColor.showNight, // 开启暗黑模式
            //         compact: true, // 开启紧凑模式
            //     })
            // }
            process.browser && window.less.modifyVars(options).then(() => {
                console.log(themeColor, 'success')
            }).
                catch(error => {
                    console.log(themeColor, error)
                })
        }
    }
    render () {
        const { Component, pageProps, router } = this.props
        if (process.browser) {
            window.$api = $api
        }
        const currentRouter = routes.filter(el => el.path === router.pathname && el.meta && el.meta.hideLayout)[0]
        const hideLayout = currentRouter && currentRouter.meta && currentRouter.meta.hideLayout
        return (
            !hideLayout ? <Layout {...pageProps}>
                <Component {...pageProps} />
            </Layout> : <Component {...pageProps} />
        )
    }
}
export default AntApp