import { Module } from '@nestjs/common';
import { SettingController } from './setting.controller';
import { SettingService } from './setting.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Setting } from '../../entities/setting.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service';
@Module({
    imports: [TypeOrmModule.forFeature([Setting]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
        secretOrPrivateKey: 'secretKey',
        signOptions: {
            expiresIn: 3600
        }
    })],
    exports: [SettingService],
    controllers: [SettingController],
    providers: [SettingService, AuthService],
})
export class SettingModule { }