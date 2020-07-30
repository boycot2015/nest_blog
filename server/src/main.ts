// import * as express from 'express';
import * as bodyParser from 'body-parser';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { TransformInterceptor } from './interceptor/transform.interceptor';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
const schedule = require('node-schedule');

const  scheduleCronstyle = ()=>{
  //每分钟的第30秒定时执行一次:
    schedule.scheduleJob('30 * * * * *',()=>{
        console.log('scheduleCronstyle:' + new Date());
    }); 
}

scheduleCronstyle();
// const instance = express();
// instance.use(bodyParser.json());
async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.use(bodyParser.json())
    // 全局注册错误的过滤器
    app.useGlobalFilters(new HttpExceptionFilter());
    // 全局注册拦截器
    app.useGlobalInterceptors(new TransformInterceptor());

    // 处理跨域
    app.enableCors();

    // 静态文件托管
    app.useStaticAssets('uploads', { prefix: '/uploads' });

    // swagger配置
    const options = new DocumentBuilder()
        .setTitle('React + Nodejs + Nestjs 全栈项目-后台管理API')
        .setDescription('供后台管理界面调用的服务端API')
        .setVersion('1.1')
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api-docs', app, document);
    // app.set('host', '192.168.0.111');
    await app.listen(4000);
}
bootstrap();
