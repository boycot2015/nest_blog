import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { TagController } from './tag.controller';

import { TagService } from './tag.service';
import { AuthService } from '../auth/auth.service';

import { Tag } from '../../entities/tag.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Tag]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
        secretOrPrivateKey: 'secretKey',
        signOptions: {
            expiresIn: 3600
        }
    })],
    exports: [TagService],
    controllers: [TagController],
    providers: [TagService, AuthService],
})
export class TagModule { }
