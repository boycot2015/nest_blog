import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';

import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './modules/auth/auth.service';
@Controller()
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
}
