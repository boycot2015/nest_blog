import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { UploadController } from './file.controller';
import { FileService } from './file.service';
import { MinioModule } from '../minio/minio.module';
import { AuthService } from '../auth/auth.service';

import { File } from '../../entities/file.entity';

@Module({
    imports: [
        MinioModule,
        TypeOrmModule.forFeature([File]),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            secretOrPrivateKey: 'secretKey',
            signOptions: {
                expiresIn: 3600
            }
        })],
    exports: [FileService],
    controllers: [UploadController],
    providers: [AuthService, FileService],
})
export class UploadModule { }
