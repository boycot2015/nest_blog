
import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TagModule } from '../tag/tag.module';

import { Category } from '../../entities/category.entity';

import { CategoryController } from './category.controller';

import { CategoryService } from './category.service';
import { AuthService } from '../auth/auth.service';

@Module({
    imports: [TypeOrmModule.forFeature([Category]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
        secretOrPrivateKey: 'secretKey',
        signOptions: {
            expiresIn: 3600
        }
    }), TagModule],
    exports: [CategoryService],
    controllers: [CategoryController],
    providers: [CategoryService, AuthService],
})
export class CategoryModule { }
