# blog

## 基于nodejs + nuxtjs 个人博客前台pc端

## 目录结构
```text

|——.nuxt                打包文件目录
|——api                  api接口
|——assets               静态资源 img、css、less、js
|——components           公共组件
    |——Comment          评论组件
    |——Editor           文本编辑器
    |——LoadingMore      加载更改
    |——MessageBox       全局信息弹框组件
|——config               全局数据配置
|——directives           自定义vue指令方法
|——filters              全局过滤器
|——layouts              页面布局组件
|——middleware           路由中间件，在路由加载之前执行的一些方法
|——pages                所有页面
|——plugins              第三方插件，包括全局方法配置
|——static               网站静态资源，如网站图标、logo等
|——store                vuex数据存储
|——utils                公共的函数，方法，工具库
.eslintrc.js            eslint代码规范配置文件
.gitignore              忽略配置文件
nuxt.config.js          项目配置文件
package.json            包管理文件
tailwind.config.js      tailwind.css样式配置文件
README.md               项目说明文档
```
## 启动项目

```bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```

如需了解更多,请访问nuxt官方文档 [Nuxt.js docs](https://nuxtjs.org).
