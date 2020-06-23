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
                    <meta name="referrer" content="no-referrer" />
                    <meta name="baidu-site-verification" content="FkRnzHszOA" />
                    <style>{`body { margin: 0 } /* custom! */`}</style>
                    {/* <script src="http://fw.qq.com/ipaddress"></script> */}
                    {/* <script src="http://pv.sohu.com/cityjson?ie=utf-8"></script> */}
                    {/* {process.env.NODE_ENV !== 'production' && process.brower && (<link rel="stylesheet" type="text/css" href={'/_next/static/css/styles.chunk.css?v=' + Router.pathname} />)} */}
                </Head>
                <body className="custom_class">
                    <link rel="stylesheet/less" type="text/css" href="./static/css/color.less" />
                    {/* <!--这里link放在哪，style生成在哪里，注意样式被覆盖--> */}
                    <Main />
                    <NextScript />
                    <script src="https://cdn.bootcss.com/less.js/2.7.3/less.min.js"></script>
                </body>
            </html>
        )
    }
}