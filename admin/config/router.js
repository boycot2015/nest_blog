import {
    MenuUnfoldOutlined,
    SisternodeOutlined,
    RobotOutlined,
    UnorderedListOutlined,
    SettingOutlined,
    CommentOutlined,
    UserOutlined,
    TagsOutlined,
    SkinOutlined,
    FormatPainterOutlined,
    FileSearchOutlined
} from '@ant-design/icons';
const routes = [
    {
        path: '/',
        name: 'home',
        meta: {
            title: '控制台',
            icon: <RobotOutlined style={
                {
                    fontSize: '20px'
                }
            } />,
            showInMenu: true,
            login: false
        }
    },
    {
        path: '/login',
        name: 'login',
        meta: {
            title: '登录',
            hideLayout: true,
            login: false
        }
    },
    {
        path: '/register',
        name: 'register',
        meta: {
            title: '注册',
            hideLayout: true,
            login: false
        }
    },
    {
        path: '/userCenter',
        name: 'userCenter',
        meta: {
            title: '个人中心',
            login: false
        }
    },
    {
        path: '/article',
        name: 'article',
        meta: {
            title: '文章列表',
            icon: <UnorderedListOutlined style={
                {
                    fontSize: '20px'
                }
            } />,
            showInMenu: true,
            login: false
        }
    },
    {
        path: '/comment',
        name: 'comment',
        meta: {
            title: '评论列表',
            icon: <CommentOutlined style={
                {
                    fontSize: '20px'
                }
            } />,
            showInMenu: true,
            login: false
        }
    },
    {
        path: '/user',
        name: 'user',
        meta: {
            title: '用户列表',
            icon: <UserOutlined style={
                {
                    fontSize: '20px'
                }
            } />,
            showInMenu: true,
            login: false
        }
    },
    {
        path: '/tag',
        name: 'tag',
        meta: {
            title: '标签管理',
            icon: <TagsOutlined style={
                {
                    fontSize: '20px'
                }
            } />,
            showInMenu: true,
            login: false
        }
    },
    {
        path: '/category',
        name: 'category',
        meta: {
            title: '分类管理',
            icon: <SisternodeOutlined style={
                {
                    fontSize: '20px'
                }
            } />,
            showInMenu: true,
            login: false
        }
    },
    {
        path: '/file',
        name: 'file',
        meta: {
            title: '文件管理',
            icon: <FileSearchOutlined style={
                {
                    fontSize: '20px'
                }
            } />,
            showInMenu: true,
            login: false
        }
    },
    {
        path: '/setting',
        name: 'setting',
        meta: {
            title: '设置',
            icon: <SettingOutlined style={
                {
                    fontSize: '20px'
                }
            } />,
            showInMenu: true,
            login: false
        },
        children: [{
            path: '/setting/theme',
            name: 'theme',
            meta: {
                title: '主题设置',
                icon: <SkinOutlined style={
                    {
                        fontSize: '20px'
                    }
                } />,
                showInMenu: true,
                login: false
            }
        }, {
            path: '/setting',
            name: 'setting',
            meta: {
                title: '自定义装修',
                icon: <FormatPainterOutlined style={
                    {
                        fontSize: '20px'
                    }
                } />,
                showInMenu: true,
                login: false
            }
        }]
    }
]
export default routes