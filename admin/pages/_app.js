import App, { Container } from 'next/app'
// import 'antd/dist/antd.css'
import Layout from '@/layouts';
import axios from '@/api/axios'
import SetCookie from '@/middleware/header'
import api from '@/api/apiList'
import routes from '@/config/router'
class AntApp extends App {
    static async getInitialProps ({ Component, ctx, router }) {
        if (Component.getInitialProps) {
            const { req, query } = ctx
            if (!process.browser) {
                // 服务端设置请求头token
                SetCookie(ctx)
            }
            let pageProps = await Component.getInitialProps({ ctx, router, api })
            return { pageProps }
        } else { return {} }
    }
    render () {
        const { Component, pageProps, router } = this.props
        React.$api = api
        const currentRouter = routes.filter(el => el.path === router.pathname && el.meta && el.meta.hideLayout)[0]
        const hideLayout = currentRouter && currentRouter.meta && currentRouter.meta.hideLayout
        console.log(currentRouter, 'this.props')
        return (
            <Container>
                {!hideLayout ? <Layout>
                    <Component {...pageProps} />
                </Layout> : <Component {...pageProps} />}
            </Container>
        )
    }
}
export default AntApp