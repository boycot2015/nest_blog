
import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TagModule } from '../tag/tag.module';

import { Article } from '../../entities/article.entity';

import { ArticleController } from './article.controller';

import { ArticleService } from './article.service';
import { AuthService } from '../auth/auth.service';

@Module({
    imports: [TypeOrmModule.forFeature([Article]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
        secretOrPrivateKey: 'secretKey',
        signOptions: {
            expiresIn: 3600
        }
    }), TagModule],
    exports: [ArticleService],
    controllers: [ArticleController],
    providers: [ArticleService, AuthService],
})
export class ArticleModule { }
