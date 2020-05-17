import Document, { Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
    static async getInitialProps (ctx) {
        const initialProps = await Document.getInitialProps(ctx)
        return { ...initialProps }
    }

    render () {
        return (
            <html>
                <Head>
                    <style>{`body { margin: 0 } /* custom! */`}</style>
                    {/* <script src="http://fw.qq.com/ipaddress"></script> */}
                    {/* <script src="http://pv.sohu.com/cityjson?ie=utf-8"></script> */}
                    {process.env.NODE_ENV !== 'production' && process.brower && (<link rel="stylesheet" type="text/css" href={'/_next/static/css/styles.chunk.css?v=' + Router.pathname} />)}
                </Head>
                <body className="custom_class">
                    <Main />
                    <NextScript />
                </body>
            </html>
        )
    }
}