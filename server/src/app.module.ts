import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import { ArticleModule } from './modules/article/article.module';
import { UsersModule } from './modules/users/users.module';
import { MinioModule } from './modules/minio/minio.module';
import { UploadModule } from './modules/file/file.module';
import { CommentModule } from './modules/comment/comment.module';
import { CategoryModule } from './modules/category/category.module';

import { TagModule } from './modules/tag/tag.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './modules/auth/auth.service';
import { JwtStrategy } from './modules/auth/jwt.strategy';


@Module({
    imports: [
        TypeOrmModule.forRoot(),
        ArticleModule,
        UsersModule,
        TagModule,
        UploadModule,
        MinioModule,
        CommentModule,
        CategoryModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            secretOrPrivateKey: 'secretKey',
            signOptions: {
                expiresIn: 3600,
            },
        }),
    ],
    controllers: [AppController],
    providers: [AppService, AuthService, JwtStrategy]
})
export class AppModule {
    constructor(private readonly connection: Connection) { }
}
