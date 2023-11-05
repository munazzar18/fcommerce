import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { sendJson } from 'src/helpers/helpers';
import { RegisterUserDto } from 'src/user/registerUser.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ){}

    @UseGuards(AuthGuard('local'))
    @Post('login')
    async login (@Request() req){
        const token = await this.authService.login(req.user)
        return sendJson(true, 'User login successfully', {
            access_token: token.access_token
        })
    }

    @Post('register')
    async register(@Body() data: RegisterUserDto){
        const token = await this.authService.register(data)
        return sendJson(true, 'User register successfully', {
            access_token: token.access_token
        })
    }

}
