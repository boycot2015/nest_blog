import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Comment } from '../../entities/comment.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ArticleModule } from '../../modules/article/article.module';
import { AuthService } from '../auth/auth.service';
@Module({
    imports: [TypeOrmModule.forFeature([Comment]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
        secretOrPrivateKey: 'secretKey',
        signOptions: {
            expiresIn: 3600
        }
    }), ArticleModule],
    controllers: [CommentController],
    providers: [CommentService, AuthService],
})
export class CommentModule { }