import App, { Container } from 'next/app'
import 'antd/dist/antd.css'
import Layout from '../layouts';
import api from '../api';
class AntApp extends App {
    static async getInitialProps( { Component } ) {
        if(Component.getInitialProps){
            let pageProps = await Component.getInitialProps({ api })
            return { pageProps }
        }else{ return { } }
    }
    render() {
        const { Component, pageProps } = this.props
        return(
            <Container>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </Container>
        )
    }
}
export default AntApp