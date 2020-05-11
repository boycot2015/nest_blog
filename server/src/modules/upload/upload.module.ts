import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { MinioModule } from '../minio/minio.module';
import { AuthService } from '../auth/auth.service';

import { Tag } from '../../entities/tag.entity';

@Module({
    imports: [
        MinioModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            secretOrPrivateKey: 'secretKey',
            signOptions: {
                expiresIn: 3600
            }
        })],
    exports: [UploadService],
    controllers: [UploadController],
    providers: [AuthService, UploadService],
})
export class UploadModule { }
