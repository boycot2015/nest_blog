export const routes = [{
    path: '/',
    name: 'home',
    meta: {
        title: '首页',
        login: false, // 是否需要登录才能访问
        icon: 'icon-home',
        showInNav: true, // 是否显示在快捷导航
        showInMenu: true, // 是否显示在菜单栏
        showTitle: false, // 是否显示标题及导航
        cache: false, // 是否需要缓存页面
        showNav: false,
        showMenu: true // 是否显示底部菜单
    }
},
{
    path: '/login',
    name: 'login',
    meta: {
        title: '登录',
        showTitle: false,
        showMenu: false
    }
},
{
    path: '/category',
    name: 'category',
    meta: {
        title: '分类列表',
        menuTitle: '分类',
        icon: 'icon-cate',
        showTitle: false,
        showInMenu: true,
        showMenu: true
    }
},
{
    path: '/product',
    name: 'product',
    meta: {
        title: '商品列表',
        menuTitle: '商品',
        icon: 'icon-shop',
        showInNav: true, // 是否显示在快捷导航
        showTitle: false,
        showInMenu: true,
        showNav: false,
        showMenu: true
    }
},
{
    path: '/userCenter',
    name: 'userCenter',
    meta: {
        title: '个人中心',
        menuTitle: '我的',
        login: true,
        icon: 'icon-user',
        showInNav: true, // 是否显示在快捷导航
        showTitle: false,
        showInMenu: true,
        showNav: false,
        showMenu: true
    }
}]