import React, { Fragment } from 'react'
import Header from './header'
import Footer from './footer'
import Nav from './nav'
import Router, { withRouter } from 'next/router';
import Head from 'next/head';
import '../static/scss/index.scss';
import '../static/css/index.css'
// import 'weui';
// import 'react-weui/build/packages/react-weui.css';
import { Button } from 'antd-mobile';
import { routes } from '../config/index';

class Layout extends React.Component {
    constructor (props) {
        super(props)
    }
    state = {
        currentRoute: routes.filter(el => el.path === this.props.router.pathname)[0],
    }
    static async getInitialProps({ req }) {
        const userAgent = req ? req.headers['user-agent'] : navigator.userAgent
        return { userAgent }
    }
    setActiveRouter (route) {
        this.setState({
            currentRoute: route
        })
        Router.push(route.path)
    }
    render () {
        let currentRoute = this.state.currentRoute
        return (
            <Fragment>
                <Head title={'react-mobile'}>
                    <meta content="width=device-width,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no" name="viewport" />
                    {/* <script src="../static/js/antm-viewport.min.js" as="script"></script> */}
                    <script src="../static/js/common.js" as="script"></script>
                    {/* <link rel="stylesheet" href='../static/scss/index.scss'></link> */}
                </Head>
                <div className='g-flexview'>
                    {currentRoute.meta && currentRoute.meta.showTitle && <Header></Header>}
                    {currentRoute.meta && currentRoute.meta.showNav && <Nav setActiveRouter={(el) => this.setActiveRouter(el)}></Nav>}
                    <h1 className={'bg-gray-200 font-size-22 hover:bg-white hover:border-gray-300'}>123123123123132</h1>
                    <div className='g-scrollview'>{this.props.children}</div>
                    {currentRoute.meta && currentRoute.meta.showMenu && <Footer activeIndex={currentRoute.path}></Footer>}
                </div>
            </Fragment>
        )
    }
}
export default withRouter(Layout)