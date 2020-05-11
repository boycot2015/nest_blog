// import * as express from 'express';
import * as bodyParser from 'body-parser';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { TransformInterceptor } from './interceptor/transform.interceptor';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
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
    .setTitle('Nodejs + Nestjs 全栈项目-后台管理API')
    .setDescription('供后台管理界面调用的服务端API')
    .setVersion('1.0')
    // .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);
  await app.listen(4000);
}
bootstrap();
