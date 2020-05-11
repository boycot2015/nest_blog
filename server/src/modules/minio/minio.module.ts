import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { MinioController } from './minio.controller';

import { AuthService } from '../auth/auth.service';
import { MinioService } from '../minio/minio.service';

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            secretOrPrivateKey: 'secretKey',
            signOptions: {
                expiresIn: 3600
            }
        })],
    exports: [MinioService],
    controllers: [MinioController],
    providers: [AuthService, MinioService],
})
export class MinioModule { }
