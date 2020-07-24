# nest_blog

## 基于nodejs + nextjs + nestjs + typeorm + minio (文件存储) 个人博客全栈项目

## 目录结构
```text

|——admin                后台管理
|——server               服务端
|——client               客户端
    |——mobile         移动端前台
    |——pc             pc端前台
.gitignore              忽略配置文件
deploy.js               webhooks自动化代码部署工具
README.md               项目说明文档
```
## 启动项目
```bash
  #   服务端
  cd server
  npm install # yarn install
  npm run start # npm run start:dev #(dev热更新)
  #   admin
  cd admin
  npm install # yarn install
  npm run dev # yarn dev  #(dev热更新)

  #  客户端(pc)
  cd client/pc
  npm install # yarn install
  npm run dev #(dev热更新)
  #  打包部署
  npm run build # yarn build
  
  # 客户端(mobile)
  cd client/mobile
  npm install # yarn install
  npm run serve # yarn serve #(dev热更新)
  #   打包部署
  npm run build # yarn build
```

* 相关技术参考链接

1. [Node.js 中文网](http://nodejs.cn/)
2. [Next.js 一个轻量级的 React 服务端渲染应用框架。](https://www.nextjs.cn/)
3. [Nuxt.js 是一个基于 Vue.js 的通用应用框架。](https://zh.nuxtjs.org/guide)
4. [Nest (NestJS) is a framework for building efficient, scalable Node.js server-side applications.](https://docs.nestjs.com/)
5. [TypeORM是一个ORM框架，它可以运行在NodeJS、浏览器、Cordova、PhoneGap、Ionic、React Native、Expo和Electron平台上，可以与TypeScript和JavaScript (ES5, ES6, ES7)一起使用。](https://typeorm.io/#/)
6. [MinIO 是一个基于Apache License v2.0开源协议的对象存储服务。它兼容亚马逊S3云存储服务接口，非常适合于存储大容量非结构化的数据，例如图片、视频、日志文件、备份数据和容器/虚拟机镜像等，而一个对象文件可以是任意大小，从几kb到最大5T不等](https://docs.min.io/cn/javascript-client-quickstart-guide.html)
