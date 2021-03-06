import { Controller, Get, UseGuards, Query, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiQuery, ApiProperty, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './modules/auth/auth.service';
@Controller()
@ApiTags('首页数据')
export class AppController {
    constructor(
        private readonly appService: AppService,
        private readonly authService: AuthService) { }

    @Get()
    getHello(): string {
        return this.appService.getHello();
    }
    @Get('token')
    async createToken(): Promise<any> {
        return await this.authService.signIn({});
    }
    @Get('user')
    @UseGuards(AuthGuard())
    users(): any {
        return [1];
    }
    @Get('datas')
    // @UseGuards(AuthGuard())
    async datas(@Query() data): Promise<object> {
        return await this.appService.getDatas(data);
    }
    @Get('weather')
    async getWeather (@Query() data, @Request() req,) {
        return await this.appService.getWeather(data, req);
    }
}
