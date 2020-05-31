import Document, { Head, Main, NextScript } from 'next/document'
import { parseCookies, setCookie, destroyCookie } from 'nookies'
export default class MyDocument extends Document {
    static async getInitialProps (ctx) {
        const initialProps = await Document.getInitialProps(ctx)
        return { ...initialProps, ...parseCookies(ctx) }
    }
    state = {
        ...this.props
    }
    render () {
        let { themeColor = '{}' } = this.state
        themeColor = JSON.parse(themeColor)
        return (
            <html
                style={{
                    color: `${(themeColor && (themeColor.color + '!important')) || ''}`,
                    background: `${(themeColor && (themeColor.background + '!important')) || ''}`,
                }}>
                <Head>
                    <style>{`body { margin: 0 } /* custom! */`}</style>
                    {/* <script src="http://fw.qq.com/ipaddress"></script> */}
                    {/* <script src="http://pv.sohu.com/cityjson?ie=utf-8"></script> */}
                    {/* {process.env.NODE_ENV !== 'production' && process.brower && (<link rel="stylesheet" type="text/css" href={'/_next/static/css/styles.chunk.css?v=' + Router.pathname} />)} */}
                </Head>
                <body
                    style={{
                        color: `${(themeColor && (themeColor.color + '!important')) || ''}`,
                        background: `${(themeColor && (themeColor.background + '!important')) || ''}`,
                    }}
                    className="custom_class">
                    <Main />
                    <NextScript />
                </body>
            </html>
        )
    }
}