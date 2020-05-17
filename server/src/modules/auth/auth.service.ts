import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
// import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(
        // private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    async signIn(user): Promise<string> {
        // In the real-world app you shouldn't expose this method publicly
        // instead, return a token once you verify user credentials
        console.log(user, 'asdasdasdas')
        const { username, id, administrator, avatar } = user
        return this.jwtService.sign({ username, id, administrator, avatar });
    }

    async validateUser(payload: any): Promise<any> {
        // return await this.usersService.findOneByEmail(payload.email);
        return payload;
    }
}