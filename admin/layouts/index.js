import Routes from '../config/router.js'
import Router, { withRouter } from 'next/router'
import Link from 'next/link'
import {
    Layout, Menu, ConfigProvider,
    Button, Dropdown, Breadcrumb,
    Avatar, notification
} from 'antd';

import zhCN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';

import Cookies from 'js-cookies'
import config from '../config'
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    RobotOutlined,
    UnorderedListOutlined,
    SettingOutlined,
    GithubOutlined,
    UserOutlined,
    BgColorsOutlined
} from '@ant-design/icons';
import { parseCookies, setCookie, destroyCookie } from 'nookies'
import api from '../api/apiList';
import filters from '../filters';

const { SubMenu } = Menu;
const { Header, Sider, Content } = Layout;
React.$api = api;
React.$filters = filters;
moment.locale('zh-cn');

import '../static/css/index.css'
import '../static/scss/index.scss'
const menu = (props) => {
    const handlerHeader = (e) => {
        if (e.key === 'item_1') {
            destroyCookie({}, 'token')
            Router.push('/login')
        }
    }
    return (
        <Menu onClick={handlerHeader} className="text-center">
            {props.username ? <Menu.Item>
                <a rel="noopener noreferrer" href={`/user/view?id=${props.id}`}>
                    个人中心
            </a>
            </Menu.Item> : null}
            <Menu.Item>
                {!props.username ? <a rel="noopener noreferrer">
                    登录
            </a> : <span>退出登录</span>}
            </Menu.Item>
        </Menu>
    )
}

class Container extends React.Component {
    constructor(props) {
        super(props)
    }
    initData = () => {
        let currentRoute = Routes[0]
        Routes.map(el => {
            if (el.path === this.props.router.pathname) {
                currentRoute = el
            }
        })
        return {
            collapsed: false,
            currentRoute,
            defaultSelectedKeys: [this.props.router.pathname]
        }
    }
    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed
        })
    }

    state = {
        userinfo: this.props.userinfo,
        ...this.initData()
    }
    handlerMenuClick = (el) => {
        this.setState({
            currentRoute: el
        });
        Router.push(el.path)
    }
    componentDidMount () {
        // console.log(this.props.cookies, 'this.props.cookies')
        const { router } = this.props
        router.prefetch('/dynamic')
    }
    render () {
        return (
            <Layout className="flex-row">
                <Sider
                    theme="light"
                    trigger={null}
                    collapsible
                    collapsed={this.state.collapsed}
                    style={{
                        overflow: 'auto',
                        height: '100vh',
                        position: 'fixed',
                        zIndex: 10,
                        left: 0,
                    }}
                >
                    <div
                        className="logo flex items-center flex-row overflow-hidden"
                        onClick={() => {
                            Router.push('/');
                            this.setState({ currentRoute: Routes[0], defaultSelectedKeys: Routes[0] })
                        }}
                        style={{ height: 60 }}>
                        <span className='flex-1 text-center text-lg'
                            style={{ cursor: 'pointer' }}
                        >{this.state.collapsed ? 'admin' : config.websiteName}</span>
                    </div>
                    <Menu theme="light" mode="inline"
                        defaultSelectedKeys={this.state.defaultSelectedKeys}
                    >
                        {Routes.map(el =>
                            (!el.children && el.meta.showInMenu ?
                                <Menu.Item key={el.path}>
                                    <Link href={el.path}>
                                        <a>
                                            {el.meta.icon}
                                            <span>{el.meta.title}</span>
                                        </a>
                                    </Link>
                                </Menu.Item>
                                : el.children ?
                                    <SubMenu key={el.path} icon={el.meta.icon} title={el.meta.title}>
                                        {el.children.map(child => (
                                            <Menu.Item key={child.path}>
                                                <Link href={child.path}>
                                                    <a>
                                                        {child.meta.icon}
                                                        <span>{child.meta.title}</span>
                                                    </a>
                                                </Link>
                                            </Menu.Item>
                                        ))}
                                    </SubMenu>
                                    : null
                            ))}
                    </Menu>
                </Sider>
                <Layout className="site-layout" style={{ marginLeft: !this.state.collapsed ? 200 : 80, transition: 'all 0.3s' }}>
                    <Header
                        className="site-layout-background flex flex-row items-center justify-between"
                        style={{
                            backgroundColor: '#fff',
                            overflow: 'auto',
                            width: !this.state.collapsed ? 'calc(100vw - 200px)' : 'calc(100vw - 80px)',
                            position: 'fixed',
                            zIndex: 9,
                            transition: 'all 0.3s',
                            left: !this.state.collapsed ? 200 : 80,
                        }}
                    >
                        <div className='flex-2 flex flex-row items-center justify-between' >
                            {React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                                className: 'trigger text-lg tl',
                                onClick: this.toggle,
                            })}
                            <BgColorsOutlined className='tl' />
                            <Button type="primary" onClick={() => Router.push('/article/add')}>发表文章</Button>
                        </div>
                        <div className={'userinfo text-right flex flex-3 flex-row items-center'}>
                            <Avatar className={'mr-5  text-orange-f9 bg-gray-200 cursor-pointer'}
                                onClick={() => window.open('https://github.com/boycot2015/nest_blog')}
                                icon={<GithubOutlined />} />
                            <Dropdown overlay={menu(this.state.userinfo)} placement="bottomCenter">
                                <div className='login-cont cursor-pointer'
                                    onClick={() => this.state.userinfo.username ?
                                        Router.push(`/user/view?id=${this.state.userinfo.id}`)
                                        : Router.push('/login?redirect=' + this.props.router.pathname)}
                                >
                                    <Avatar
                                        className={'mr-2 text-orange-f9 bg-gray-200'}
                                        src={this.state.userinfo.avatar}
                                        icon={
                                            this.state.userinfo.avatar && <UserOutlined />
                                        }
                                    />
                                    <span>{this.state.userinfo.username}</span>
                                </div>
                            </Dropdown>
                        </div>
                    </Header>
                    <Breadcrumb className="h-5 leading-5 mt-20 ml-5">
                        <Breadcrumb.Item href="">
                            <RobotOutlined />
                        </Breadcrumb.Item>
                        <Breadcrumb.Item href={this.state.currentRoute.path}>
                            <span>{this.state.currentRoute.meta.title}</span>
                        </Breadcrumb.Item>
                    </Breadcrumb>
                    <Content
                        className="site-layout-background bg-white"
                        style={{
                            margin: '24px 16px',
                            padding: 24,
                            minHeight: 'calc(100vh - 148px)',
                        }}
                    >
                        <ConfigProvider locale={zhCN}>
                            {this.props.children}
                        </ConfigProvider>
                    </Content>
                </Layout>
            </Layout >
        );
    }
}
export default withRouter(Container)