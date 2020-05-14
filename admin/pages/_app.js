import App, { Container } from 'next/app'
import 'antd/dist/antd.css'
import Layout from '@/layouts';
import axios from '@/api/axios'
import SetCookie from '@/middleware/header'
import api from '@/api/apiList'
import filters from '@/filters';
import routes from '@/config/router'
import { Base64 } from 'js-base64'
import { parseCookies, setCookie, destroyCookie } from 'nookies'

class AntApp extends App {
    static async getInitialProps ({ Component, ctx, router, redirect }) {
        if (Component.getInitialProps) {
            let cookies = {}
            let userinfo = { visitors: true }
            // const {res, req } = ctx
            cookies = parseCookies(ctx);
            SetCookie(ctx)
            cookies.token && (userinfo = JSON.parse(Base64.decode(cookies.token.split('.')[1])))
            let pageProps = await Component.getInitialProps({ ctx, router, api, cookies, userinfo })
            pageProps = { cookies, userinfo, ...pageProps }
            return { pageProps }
        } else return {}
    }
    render () {
        const { Component, pageProps, router } = this.props
        if (process.browser) {
            window.$api = api
            window.$filters = filters
        }
        const currentRouter = routes.filter(el => el.path === router.pathname && el.meta && el.meta.hideLayout)[0]
        const hideLayout = currentRouter && currentRouter.meta && currentRouter.meta.hideLayout
        return (
            <Container>
                {!hideLayout ? <Layout {...pageProps}>
                    <Component {...pageProps} />
                </Layout> : <Component {...pageProps} />}
            </Container>
        )
    }
}
export default AntApp